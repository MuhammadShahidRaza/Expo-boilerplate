import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  coordinates: Coordinates | null;
};

const initialState: LocationState = {
  coordinates: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCoordinates(state, action: PayloadAction<Coordinates | null>) {
      state.coordinates = action.payload;
    },
  },
});

export const { setCoordinates } = locationSlice.actions;
export const locationReducer = locationSlice.reducer;
