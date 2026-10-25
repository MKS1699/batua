import { CreateUserInput } from '@/db/users';
import { colors, typography } from '@/theme';
import { Currency } from '@/types/dataTypes';
import { USER_NAME_MAX_LENGTH } from '@/utils/validators/user';
import { randomSuperhero } from 'superheroes';

export const isoToLocaleFull = (date: string) => {
  return new Date(date).toLocaleString();
};

export const isoToLocaleDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export const randomUser = (): CreateUserInput => {
  let name = randomSuperhero();
  let attempts = 1;

  while (name.length > USER_NAME_MAX_LENGTH && attempts < 10) {
    name = randomSuperhero();
    attempts++;
  }

  if (name.length > USER_NAME_MAX_LENGTH) {
    name = 'Superhero User';
  }

  const emailName = name.toLowerCase().replace(/\s+/g, '').trim();

  return {
    email: `${emailName}@batua.com`,
    name,
    phone: '+911234567890',
  };
};

export const moneyFormatter = (currency: Currency, value: string): string => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return '';

  return new Intl.NumberFormat('en-In', { style: 'currency', currency })
    .formatToParts(amount)
    .filter((part) => part.type !== 'currency')
    .map((part) => part.value)
    .join('')
    .trim();
};

export function objectLogger(title: string, object: unknown) {
  if (object !== null && typeof object === 'object') {
    console.log(`${title}:`, JSON.stringify(object, null, 2));
    return;
  }

  console.log(`${title}:`, object);
}

export enum GenericDates {
  today = 'Today',
  yesterday = 'Yesterday',
  undefined = 'Undefined Date',
}

export function getGenericDate(currDate: Date): GenericDates {
  if (Number.isNaN(currDate.getTime())) {
    return GenericDates.undefined;
  }

  const today = new Date();
  const yesterday = new Date();

  today.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const current = new Date(currDate);
  current.setHours(0, 0, 0, 0);

  if (current.getTime() === today.getTime()) {
    return GenericDates.today;
  }

  if (current.getTime() === yesterday.getTime()) {
    return GenericDates.yesterday;
  }

  return GenericDates.undefined;
}

export type IconColors = keyof typeof colors;
export type TypographyVariant = keyof typeof typography;
export const iconSize = (variant: TypographyVariant) => typography[variant].fontSize;
