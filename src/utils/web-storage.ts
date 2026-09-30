type KeyValueStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const memory = new Map<string, string>();

const memoryStorage: KeyValueStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value);
  },
  removeItem: (key) => {
    memory.delete(key);
  },
};

function browserStorage(): KeyValueStorage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    if (typeof localStorage.getItem !== 'function') return null;
    if (typeof localStorage.setItem !== 'function') return null;
    if (typeof localStorage.removeItem !== 'function') return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function webStorage() {
  return browserStorage() ?? memoryStorage;
}
