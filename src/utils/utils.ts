import { CreateUserInput } from '@/db/users';
import { randomSuperhero } from 'superheroes';

export const isoToLocale = (date: string) => {
  return new Date(date).toLocaleString();
};

export const randomUser = (): CreateUserInput => {
  const name = randomSuperhero();
  const emailName = name.toLowerCase().replace(/\s+/g, '').trim().toString();
  return {
    email: `${emailName}@budgetplanner.com`,
    name,
    phone: '+911234567890',
  };
};
