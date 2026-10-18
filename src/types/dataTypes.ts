import CurrencyData from '@/data/currencies.json';
import CurrencyCountries from '@/data/current_currencies_country.json';

export { CurrencyCountries, CurrencyData };

export type Currency = keyof typeof CurrencyData;
export type CurrencyOption = (typeof CurrencyData)[Currency];
export const CurrencyCodes = Object.keys(CurrencyData) as Currency[];
export const CurrencyList = Object.values(CurrencyData);
export const CurrencyCountryList = Object.values(CurrencyCountries);

export enum TransactionType {
  income = 'income',
  expense = 'expense',
}

export enum PaymentMethod {
  cash = 'cash',
  upi = 'upi',
  bankTransfer = 'bankTransfer',
  debitCard = 'debitCard',
  creditCard = 'creditCard',
  other = 'other',
}

export enum UserBudgetRole {
  owner = 'owner',
  admin = 'admin',
  contributor = 'contributor',
  viewer = 'viewer',
}

interface BudgetMembership {
  id: string;
  budgetId: Budget['id'];
  userId: User['id'];
  role: UserBudgetRole;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
}

interface Transaction {
  id: string;
  budgetId: Budget['id'];
  amount: number;
  title: string;
  description: string;
  originalCurrency: Currency;
  transactionType: TransactionType;
  paymentMethod: PaymentMethod;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User['id'];
}

interface Budget {
  id: string;
  name: string;
  description: string;
  ownerId: User['id'];
  startDate: string;
  endDate: string | null;
  currency: Currency;
  isShareable: boolean;
  createdAt: string;
  updatedAt: string;
  limitAmount: number | null;
}

interface UserPreference {
  userId: User['id'];
  defaultBudgetId: Budget['id'];
}
