import { useEffect, useState } from 'react';

import { loadSavedLanguage } from '@/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSavedLanguage()
      .then((reloading) => {
        if (!cancelled && !reloading) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return children;
}
