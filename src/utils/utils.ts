import { CreateUserInput } from '@/db/users';
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
