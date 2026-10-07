// @ts-nocheck
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  validateContact,
  validateEvent,
  validateListing,
  validateLogin,
  validatePasswordChange,
  validateIdentity,
  validateSignUp,
} from './index.ts';

const t = (key: string) => key;

describe('validateLogin', () => {
  it('rejects empty input', () => {
    assert.deepEqual(validateLogin({ email: '', password: '' }, t), {
      email: 'validation.emailRequired',
      password: 'validation.passwordRequired',
    });
  });

  it('rejects whitespace-only email as missing', () => {
    assert.deepEqual(validateLogin({ email: '   ', password: 'secret' }, t), {
      email: 'validation.emailRequired',
    });
  });

  it('rejects an invalid email', () => {
    assert.deepEqual(validateLogin({ email: 'not-an-email', password: 'secret' }, t), {
      email: 'validation.emailInvalid',
    });
  });

  it('accepts a valid login even when the password is weak', () => {
    assert.deepEqual(validateLogin({ email: ' ada@example.com ', password: 'weak' }, t), {});
  });
});

describe('validateSignUp', () => {
  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'password1!',
    confirm: 'password1!',
    accepted: true,
  };

  it('rejects empty input', () => {
    assert.deepEqual(
      validateSignUp({ name: '', email: '', password: '', confirm: '', accepted: false }, t),
      {
        name: 'validation.nameRequired',
        email: 'validation.emailRequired',
        password: 'validation.passwordRequired',
        accepted: 'validation.mustAgree',
      },
    );
  });

  it('rejects an invalid email', () => {
    assert.deepEqual(validateSignUp({ ...valid, email: 'ada@' }, t), {
      email: 'validation.emailInvalid',
    });
  });

  it('rejects a weak password', () => {
    assert.deepEqual(validateSignUp({ ...valid, password: 'password', confirm: 'password' }, t), {
      password: 'validation.passwordWeak',
    });
  });

  it('rejects a password mismatch', () => {
    assert.deepEqual(validateSignUp({ ...valid, confirm: 'password2!' }, t), {
      confirm: 'validation.passwordMismatch',
    });
  });

  it('accepts a valid sign up', () => {
    assert.deepEqual(validateSignUp(valid, t), {});
  });
});

describe('validatePasswordChange', () => {
  it('rejects empty input', () => {
    assert.deepEqual(validatePasswordChange({ current: '', next: '', confirm: '' }, t), {
      current: 'validation.passwordRequired',
      next: 'validation.passwordWeak',
    });
  });

  it('rejects a weak password', () => {
    assert.deepEqual(
      validatePasswordChange({ current: 'old-password', next: 'short1!', confirm: 'short1!' }, t),
      { next: 'validation.passwordWeak' },
    );
  });

  it('rejects a password mismatch', () => {
    assert.deepEqual(
      validatePasswordChange({ current: 'old-password', next: 'Password1!', confirm: 'Password2!' }, t),
      { confirm: 'validation.passwordMismatch' },
    );
  });

  it('accepts a valid password change', () => {
    assert.deepEqual(
      validatePasswordChange({ current: 'old-password', next: 'Password1!', confirm: 'Password1!' }, t),
      {},
    );
  });
});

describe('validateContact', () => {
  it('rejects empty input', () => {
    assert.deepEqual(validateContact({ subject: '', message: '' }, t), {
      subject: 'validation.subjectRequired',
      message: 'validation.messageRequired',
    });
  });

  it('accepts a valid contact form', () => {
    assert.deepEqual(
      validateContact({ subject: 'Help', message: 'Need a hand with my account.' }, t),
      {},
    );
  });
});

describe('validateEvent', () => {
  it('rejects empty input', () => {
    assert.deepEqual(
      validateEvent({ name: '', date: '', time: '', details: '', location: '' }, t),
      {
        name: 'validation.eventName',
        date: 'validation.eventDate',
        time: 'validation.eventTime',
        details: 'validation.eventDetails',
        location: 'validation.eventLocation',
      },
    );
  });

  it('accepts a valid event', () => {
    assert.deepEqual(
      validateEvent(
        {
          name: 'Town hall',
          date: '2026-10-02',
          time: '18:00',
          details: 'Agenda and speakers for the evening.',
          location: 'Hall',
        },
        t,
      ),
      {},
    );
  });
});

describe('validateListing', () => {
  const valid = {
    title: 'Oak desk',
    description: 'Solid oak desk in good condition.',
    category: 'furniture',
    price: '120',
    photos: 1,
  };

  it('rejects empty input', () => {
    assert.deepEqual(
      validateListing({ title: '', description: '', category: '', price: '', photos: 0 }, t),
      {
        photos: 'validation.photoRequired',
        title: 'validation.titleRequired',
        description: 'validation.descriptionRequired',
        category: 'validation.categoryRequired',
        price: 'validation.priceRequired',
      },
    );
  });

  it('rejects a non-positive price', () => {
    assert.deepEqual(validateListing({ ...valid, price: '0' }, t), {
      price: 'validation.priceRequired',
    });
  });

  it('accepts a valid listing', () => {
    assert.deepEqual(validateListing(valid, t), {});
  });
});

describe('validateIdentity', () => {
  it('requires a national id and a 9-digit social security number', () => {
    assert.deepEqual(validateIdentity({ nic: '12', ssn: '123', passport: '', license: '' }, t), {
      nic: 'verify.required',
      ssn: 'verify.ssnInvalid',
    });
  });

  it('accepts the required documents and leaves the others empty', () => {
    assert.deepEqual(validateIdentity({ nic: 'A12345', ssn: '123-45-6789', passport: '', license: '' }, t), {});
  });
});
