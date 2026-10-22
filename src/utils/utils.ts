import { CreateUserInput } from '@/db/users';
import { colors, typography } from '@/theme';
import { Currency } from '@/types/dataTypes';
import { randomSuperhero } from 'superheroes';
// import {} from 'intl';

export const isoToLocale = (date: string) => {
  return new Date(date).toLocaleString();
};

export const randomUser = (): CreateUserInput => {
  const name = randomSuperhero();
  const emailName = name.toLowerCase().replace(/\s+/g, '').trim().toString();
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
