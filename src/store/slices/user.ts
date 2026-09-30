import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserProfile = {
  fullName: string;
  email: string;
  avatarUri: string | null;
  role: 'user';
};

type UserState = {
  profile: UserProfile | null;
};

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    clearUser(state) {
      state.profile = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
