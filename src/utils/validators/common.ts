import { BUDGET_SELECT } from '@/db/budgets';
import { TRANSACTION_SELECT } from '@/db/transactions';
import { CurrencyCodes } from '@/types/dataTypes';

export type InputValidator<T> = (value: T) => string | null;

export const requiredText: InputValidator<string> = (value) =>
  value.trim().length > 0 ? null : 'The field is required.';

export function maxLength(limit: number): InputValidator<string> {
  return (value) => (value.length <= limit ? null : `Must be ${limit} characters or fewer.`);
}

export const positiveAmount: InputValidator<string> = (value) => {
  if (!value.trim()) {
    return 'Amount is required.';
  }

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Amount must be greater than 0 (zero).';
  }

  return null;
};

export const isValidDate: InputValidator<string> = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date format.';
  }
  return null;
};

export const noFutureDate: InputValidator<string> = (value) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const passedDate = new Date(value);
  passedDate.setHours(0, 0, 0, 0);

  if (passedDate.getTime() > now.getTime()) {
    return 'Future date transactions cannot be recorded.';
  }

  return null;
};

export function validateInput<T>(value: T, validators: InputValidator<T>[]): string | null {
  for (const validator of validators) {
    const error = validator(value);

    if (error !== null) {
      return error;
    }
  }

  return null;
}

export const emailValidator: InputValidator<string> = (value) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Invalid Email address.';
  }
  return null;
};

export const currencyValidator: InputValidator<
  TRANSACTION_SELECT['originalCurrency'] | BUDGET_SELECT['currency']
> = (currency) => {
  if (!CurrencyCodes.includes(currency)) {
    return 'Invalid Currency.';
  }
  return null;
};

export const boolValidator: InputValidator<boolean> = (bool) => {
  if (typeof bool !== 'boolean') {
    return `Invalid value. It should be of type 'boolean' i.e., 'true' or 'false'.`;
  }
  return null;
};
