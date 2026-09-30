import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import { persistStorage } from '@/store/persist-storage';
import { appReducer } from '@/store/slices/app';
import { locationReducer } from '@/store/slices/location';
import { notificationsReducer } from '@/store/slices/notifications';
import { userReducer } from '@/store/slices/user';

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  notifications: notificationsReducer,
  location: locationReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'cc-world',
    storage: persistStorage,
    whitelist: ['app', 'user'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
