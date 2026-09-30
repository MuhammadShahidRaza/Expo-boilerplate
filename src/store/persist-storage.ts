import '@/utils/install-storage';
import type { Storage } from 'redux-persist';

function storage() {
  return typeof localStorage === 'undefined' ? null : localStorage;
}

export const persistStorage: Storage = {
  getItem: (key) => Promise.resolve(storage()?.getItem(key) ?? null),
  setItem: (key, value) => {
    storage()?.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    storage()?.removeItem(key);
    return Promise.resolve();
  },
};
