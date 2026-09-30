import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { LanguageCode } from '@/constants/languages';

export type ThemeMode = 'light' | 'dark' | 'system';

type AppState = {
  isUserLoggedIn: boolean;
  hasOnboarded: boolean;
  language: LanguageCode | null;
  themeMode: ThemeMode;
};

const initialState: AppState = {
  isUserLoggedIn: false,
  hasOnboarded: false,
  language: null,
  themeMode: 'system',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsUserLoggedIn(state, action: PayloadAction<boolean>) {
      state.isUserLoggedIn = action.payload;
    },
    setHasOnboarded(state, action: PayloadAction<boolean>) {
      state.hasOnboarded = action.payload;
    },
    setAppLanguage(state, action: PayloadAction<LanguageCode>) {
      state.language = action.payload;
    },
    setAppThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    resetAppSession(state) {
      state.isUserLoggedIn = false;
    },
  },
});

export const {
  setIsUserLoggedIn,
  setHasOnboarded,
  setAppLanguage,
  setAppThemeMode,
  resetAppSession,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
