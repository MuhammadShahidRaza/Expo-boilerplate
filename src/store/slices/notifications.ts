import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type InboxItem = {
  id: string;
  title: string;
  body: string;
  receivedAt: string;
};

type NotificationsState = {
  token: string | null;
  inbox: InboxItem[];
};

const initialState: NotificationsState = {
  token: null,
  inbox: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setPushToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    addNotification(state, action: PayloadAction<InboxItem>) {
      state.inbox = [action.payload, ...state.inbox].slice(0, 50);
    },
    clearNotifications(state) {
      state.inbox = [];
    },
  },
});

export const { setPushToken, addNotification, clearNotifications } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
