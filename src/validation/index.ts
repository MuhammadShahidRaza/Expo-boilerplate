export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function passwordChecks(value: string) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
}

export function isSignupPassword(value: string) {
  const checks = passwordChecks(value);
  return checks.length && checks.number && checks.special;
}

export function isStrongPassword(value: string) {
  const checks = passwordChecks(value);
  return checks.length && checks.upper && checks.number && checks.special;
}

type Translator = (key: string) => string;

export function validateLogin(values: { email: string; password: string }, t: Translator) {
  const errors: FieldErrors<'email' | 'password'> = {};
  if (!values.email.trim()) errors.email = t('validation.emailRequired');
  else if (!isEmail(values.email)) errors.email = t('validation.emailInvalid');
  if (!values.password) errors.password = t('validation.passwordRequired');
  return errors;
}

export function validateSignUp(
  values: { name: string; email: string; password: string; confirm: string; accepted: boolean },
  t: Translator,
) {
  const errors: FieldErrors<'name' | 'email' | 'password' | 'confirm' | 'accepted'> = {};
  if (values.name.trim().length < 2) errors.name = t('validation.nameRequired');
  if (!values.email.trim()) errors.email = t('validation.emailRequired');
  else if (!isEmail(values.email)) errors.email = t('validation.emailInvalid');
  if (!values.password) errors.password = t('validation.passwordRequired');
  else if (!isSignupPassword(values.password)) errors.password = t('validation.passwordWeak');
  if (values.confirm !== values.password) errors.confirm = t('validation.passwordMismatch');
  if (!values.accepted) errors.accepted = t('validation.mustAgree');
  return errors;
}

export function validatePasswordChange(
  values: { current: string; next: string; confirm: string },
  t: Translator,
) {
  const errors: FieldErrors<'current' | 'next' | 'confirm'> = {};
  if (!values.current) errors.current = t('validation.passwordRequired');
  if (!isSignupPassword(values.next)) errors.next = t('validation.passwordWeak');
  if (values.confirm !== values.next) errors.confirm = t('validation.passwordMismatch');
  return errors;
}

export function validateContact(values: { subject: string; message: string }, t: Translator) {
  const errors: FieldErrors<'subject' | 'message'> = {};
  if (values.subject.trim().length < 3) errors.subject = t('validation.subjectRequired');
  if (values.message.trim().length < 10) errors.message = t('validation.messageRequired');
  return errors;
}

export function validateEvent(
  values: { name: string; date: string; time: string; details: string; location: string },
  t: Translator,
) {
  const errors: FieldErrors<'name' | 'date' | 'time' | 'details' | 'location'> = {};
  if (values.name.trim().length < 3) errors.name = t('validation.eventName');
  if (!values.date.trim()) errors.date = t('validation.eventDate');
  if (!values.time.trim()) errors.time = t('validation.eventTime');
  if (values.details.trim().length < 10) errors.details = t('validation.eventDetails');
  if (values.location.trim().length < 3) errors.location = t('validation.eventLocation');
  return errors;
}

export function validateListing(
  values: { title: string; description: string; category: string; price: string; photos: number },
  t: Translator,
) {
  const errors: FieldErrors<'title' | 'description' | 'category' | 'price' | 'photos'> = {};
  if (values.photos < 1) errors.photos = t('validation.photoRequired');
  if (values.title.trim().length < 3) errors.title = t('validation.titleRequired');
  if (values.description.trim().length < 10) errors.description = t('validation.descriptionRequired');
  if (!values.category) errors.category = t('validation.categoryRequired');
  const price = Number(values.price);
  if (!values.price.trim() || Number.isNaN(price) || price <= 0) errors.price = t('validation.priceRequired');
  return errors;
}

export function validateIdentity(
  values: { nic: string; ssn: string; passport: string; license: string },
  t: Translator,
) {
  const errors: FieldErrors<'nic' | 'ssn' | 'passport' | 'license'> = {};
  if (values.nic.trim().length < 5) errors.nic = t('verify.required');
  const digits = values.ssn.replace(/\D/g, '');
  if (!values.ssn.trim()) errors.ssn = t('verify.required');
  else if (digits.length !== 9) errors.ssn = t('verify.ssnInvalid');
  if (values.passport.trim() && values.passport.trim().length < 6) errors.passport = t('verify.required');
  if (values.license.trim() && values.license.trim().length < 5) errors.license = t('verify.required');
  return errors;
}
