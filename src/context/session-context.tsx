import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { signOut as firebaseSignOut } from 'firebase/auth';

import { STORAGE_KEYS } from '@/constants/storage';
import { authToken, authUser, loginRequest, uploadProfilePicture } from '@/services/api/auth';
import { hasApi } from '@/services/api/client';
import { getFirebaseAuth } from '@/services/firebase';
import { deleteSecret, getSecret, SECRET_KEYS, setSecret } from '@/services/secure-store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetAppSession, setHasOnboarded, setIsUserLoggedIn } from '@/store/slices/app';
import { clearUser, setUser, type UserProfile } from '@/store/slices/user';
import { getItem, removeItem, setItem } from '@/utils/storage';

export type Account = {
  fullName: string;
  email: string;
  password: string;
};

export type SessionUser = {
  fullName: string;
  email: string;
  avatarUri?: string | null;
};

type StoredAccount = {
  fullName: string;
  email: string;
  password?: string;
};

type SignInResult = 'ok' | 'missing' | 'invalid' | 'network';
type PasswordResult = 'ok' | 'invalid';

type SessionContextValue = {
  user: SessionUser | null;
  hasOnboarded: boolean;
  rememberedEmail: string;
  completeOnboarding: () => Promise<void>;
  signUp: (account: Account) => Promise<void>;
  signIn: (email: string, password: string, remember: boolean) => Promise<SignInResult>;
  signInSocial: (user: SessionUser) => Promise<void>;
  completeSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (user: SessionUser) => Promise<void>;
  updatePassword: (currentPassword: string, nextPassword: string) => Promise<PasswordResult>;
  resetPassword: (email: string, nextPassword: string) => Promise<PasswordResult>;
  hasAccount: (email: string) => boolean;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toProfile(user: SessionUser, avatarUri: string | null): UserProfile {
  return {
    fullName: user.fullName.trim(),
    email: normalizeEmail(user.email),
    avatarUri,
    role: 'user',
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const reduxOnboarded = useAppSelector((state) => state.app.hasOnboarded);
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [storedOnboarded, setStoredOnboarded] = useState(false);
  const [rememberedEmail, setRememberedEmail] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getItem<StoredAccount>(STORAGE_KEYS.account),
      getSecret(SECRET_KEYS.accountPassword),
      getItem<boolean>(STORAGE_KEYS.onboarded),
      getItem<string>(STORAGE_KEYS.rememberedEmail),
    ]).then(async ([savedAccount, secretPassword, onboarded, email]) => {
      if (cancelled) return;
      let password = secretPassword ?? '';
      if (savedAccount?.password && !password) {
        password = savedAccount.password;
        await setSecret(SECRET_KEYS.accountPassword, password);
        await setItem(STORAGE_KEYS.account, {
          fullName: savedAccount.fullName,
          email: savedAccount.email,
        });
      }
      if (savedAccount) {
        setAccount({
          fullName: savedAccount.fullName,
          email: savedAccount.email,
          password,
        });
      }
      setStoredOnboarded(Boolean(onboarded));
      if (onboarded) dispatch(setHasOnboarded(true));
      setRememberedEmail(email ?? '');
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const user: SessionUser | null = profile
    ? { fullName: profile.fullName, email: profile.email, avatarUri: profile.avatarUri }
    : null;
  const hasOnboarded = reduxOnboarded || storedOnboarded;

  const completeOnboarding = useCallback(async () => {
    setStoredOnboarded(true);
    dispatch(setHasOnboarded(true));
    await setItem(STORAGE_KEYS.onboarded, true);
  }, [dispatch]);

  const signUp = useCallback(async (next: Account) => {
    const stored: Account = {
      fullName: next.fullName.trim(),
      email: normalizeEmail(next.email),
      password: next.password,
    };
    setAccount(stored);
    await setSecret(SECRET_KEYS.accountPassword, stored.password);
    await setItem(STORAGE_KEYS.account, { fullName: stored.fullName, email: stored.email });
  }, []);

  const establishSession = useCallback(
    async (next: SessionUser, token?: string | null) => {
      const nextProfile = toProfile(next, next.avatarUri ?? profile?.avatarUri ?? null);
      dispatch(setUser(nextProfile));
      dispatch(setIsUserLoggedIn(true));
      if (token) await setSecret(SECRET_KEYS.authToken, token);
    },
    [dispatch, profile?.avatarUri],
  );

  const signIn = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const normalized = normalizeEmail(email);
      const rememberEmail = async () => {
        if (remember) {
          setRememberedEmail(normalized);
          await setItem(STORAGE_KEYS.rememberedEmail, normalized);
        } else {
          setRememberedEmail('');
          await removeItem(STORAGE_KEYS.rememberedEmail);
        }
      };

      if (hasApi()) {
        try {
          const response = await loginRequest(normalized, password);
          const remote = authUser(response);
          await rememberEmail();
          await establishSession(
            {
              fullName: remote?.fullName ?? remote?.full_name ?? remote?.name ?? account?.fullName ?? normalized,
              email: remote?.email ?? normalized,
              avatarUri: remote?.avatar ?? profile?.avatarUri,
            },
            authToken(response),
          );
          return 'ok' as const;
        } catch (error) {
          const offline = axios.isAxiosError(error) && !error.response;
          if (!offline) {
            return axios.isAxiosError(error) && error.response?.status === 404
              ? ('missing' as const)
              : ('invalid' as const);
          }
          console.warn('login request failed', error);
          if (!account || account.email !== normalized) return 'network' as const;
        }
      }

      if (!account || account.email !== normalized) return 'missing' as const;
      if (account.password !== password) return 'invalid' as const;
      await rememberEmail();
      await establishSession({ fullName: account.fullName, email: account.email, avatarUri: profile?.avatarUri });
      return 'ok' as const;
    },
    [account, establishSession, profile?.avatarUri],
  );

  const signInSocial = useCallback(
    async (next: SessionUser) => {
      await establishSession(next);
    },
    [establishSession],
  );

  const completeSignIn = useCallback(async () => {
    if (!account) return;
    await establishSession({
      fullName: account.fullName,
      email: account.email,
      avatarUri: profile?.avatarUri,
    });
  }, [account, establishSession, profile?.avatarUri]);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth).catch(() => undefined);
    }
    dispatch(clearUser());
    dispatch(resetAppSession());
    await deleteSecret(SECRET_KEYS.authToken);
  }, [dispatch]);

  const updateProfile = useCallback(
    async (next: SessionUser) => {
      const nextProfile = toProfile(next, next.avatarUri ?? null);
      if (hasApi() && next.avatarUri && next.avatarUri !== profile?.avatarUri) {
        try {
          await uploadProfilePicture(next.avatarUri);
        } catch (error) {
          console.warn('avatar upload failed', error);
        }
      }
      dispatch(setUser(nextProfile));
      if (account) {
        const storedAccount: Account = {
          ...account,
          fullName: nextProfile.fullName,
          email: nextProfile.email,
        };
        setAccount(storedAccount);
        await setItem(STORAGE_KEYS.account, {
          fullName: storedAccount.fullName,
          email: storedAccount.email,
        });
      }
    },
    [account, dispatch, profile?.avatarUri],
  );

  const updatePassword = useCallback(
    async (currentPassword: string, nextPassword: string) => {
      if (!account || account.password !== currentPassword) return 'invalid' as const;
      const stored = { ...account, password: nextPassword };
      setAccount(stored);
      await setSecret(SECRET_KEYS.accountPassword, nextPassword);
      return 'ok' as const;
    },
    [account],
  );

  const resetPassword = useCallback(
    async (email: string, nextPassword: string) => {
      const normalized = normalizeEmail(email);
      if (!account || account.email !== normalized) return 'invalid' as const;
      const stored = { ...account, password: nextPassword };
      setAccount(stored);
      await setSecret(SECRET_KEYS.accountPassword, nextPassword);
      return 'ok' as const;
    },
    [account],
  );

  const hasAccount = useCallback(
    (email: string) => Boolean(account && account.email === normalizeEmail(email)),
    [account],
  );

  const value = useMemo(
    () => ({
      user,
      hasOnboarded,
      rememberedEmail,
      completeOnboarding,
      signUp,
      signIn,
      signInSocial,
      completeSignIn,
      signOut,
      updateProfile,
      updatePassword,
      resetPassword,
      hasAccount,
    }),
    [
      user,
      hasOnboarded,
      rememberedEmail,
      completeOnboarding,
      signUp,
      signIn,
      signInSocial,
      completeSignIn,
      signOut,
      updateProfile,
      updatePassword,
      resetPassword,
      hasAccount,
    ],
  );

  if (!ready) return null;

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return value;
}
