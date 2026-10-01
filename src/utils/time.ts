type Translator = (key: string, options?: Record<string, unknown>) => string;

export function formatAgo(iso: string, t: Translator) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return t('time.minutes', { count: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t('time.hours', { count: hours });
  return t('time.days', { count: Math.round(hours / 24) });
}

export function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function money(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
}
