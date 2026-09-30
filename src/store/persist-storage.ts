import '@/utils/install-storage';
import type { Storage } from 'redux-persist';

import { webStorage } from '@/utils/web-storage';

export const persistStorage: Storage = {
  getItem: (key) => Promise.resolve(webStorage().getItem(key)),
  setItem: (key, value) => {
    webStorage().setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    webStorage().removeItem(key);
    return Promise.resolve();
  },
};
