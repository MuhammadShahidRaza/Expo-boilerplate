type PendingCode = {
  email: string;
  code: string;
  purpose: 'signup' | 'reset';
};

let pending: PendingCode | null = null;

export function issueCode(email: string, purpose: PendingCode['purpose']) {
  const code = String(Math.floor(1000 + Math.random() * 9000));
  pending = { email: email.trim().toLowerCase(), code, purpose };
  return code;
}

export function checkCode(email: string, code: string) {
  if (!pending) return false;
  return pending.email === email.trim().toLowerCase() && pending.code === code.trim();
}

export function currentCode(email: string) {
  if (!pending || pending.email !== email.trim().toLowerCase()) return null;
  return pending.code;
}
