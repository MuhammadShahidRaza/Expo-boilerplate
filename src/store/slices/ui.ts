import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  isAppLoading: boolean;
};

const initialState: UiState = {
  isAppLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsAppLoading(state, action: PayloadAction<boolean>) {
      state.isAppLoading = action.payload;
    },
  },
});

export const { setIsAppLoading } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
