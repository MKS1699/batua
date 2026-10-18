import { Currency, PaymentMethod, TransactionType, UserBudgetRole } from '@/types/dataTypes';
import { integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const budgetsTable = sqliteTable('budgets', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  ownerId: text('owner_id')
    .references(() => usersTable.id)
    .notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  currency: text('currency').$type<Currency>().notNull().default('INR'),
  limitAmount: real('limit_amount'),
  isShareable: integer('is_shareable', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const budgetMembershipsTable = sqliteTable(
  'budget_memberships',
  {
    id: text('id').primaryKey().notNull(),
    budgetId: text('budget_id')
      .references(() => budgetsTable.id)
      .notNull(),
    userId: text('user_id')
      .references(() => usersTable.id)
      .notNull(),
    role: text('role').$type<UserBudgetRole>().notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [unique('budget_user_unique').on(table.budgetId, table.userId)]
);

export const transactionsTable = sqliteTable('transactions', {
  id: text('id').primaryKey().notNull(),
  budgetId: text('budget_id')
    .references(() => budgetsTable.id)
    .notNull(),
  amount: real('amount').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  originalCurrency: text('original_currency').$type<Currency>().notNull().default('INR'),
  transactionType: text('transaction_type')
    .$type<TransactionType>()
    .notNull()
    .default(TransactionType.expense),
  paymentMethod: text('payment_method')
    .$type<PaymentMethod>()
    .notNull()
    .default(PaymentMethod.cash),
  transactionDate: text('transaction_date').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  createdBy: text('created_by')
    .references(() => usersTable.id)
    .notNull(),
});

export const userPreferencesTable = sqliteTable('user_preferences', {
  userId: text('user_id')
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  defaultBudgetId: text('default_budget_id')
    .references(() => budgetsTable.id)
    .notNull(),
});
