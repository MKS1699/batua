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
