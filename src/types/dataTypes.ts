export enum Currency {
  INR = 'INR',
  USD = 'USD',
  GBP = 'GBP',
  JPY = 'JPY',
}

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

export enum BudgetPeriod {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
  custom = 'custom',
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
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  currency: Currency;
  isShareable: boolean;
  createdAt: string;
  updatedAt: string;
}
