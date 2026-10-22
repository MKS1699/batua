import { desc, eq } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { db } from './client';
import { transactionsTable } from './schema';

export type TRANSACTION_INSERT = typeof transactionsTable.$inferInsert;
export type TRANSACTION_SELECT = typeof transactionsTable.$inferSelect;

// CRUD

// create
export type CreateTransactionInput = Omit<TRANSACTION_INSERT, 'id' | 'createdAt' | 'updatedAt'>;

export async function createNewTransaction(input: CreateTransactionInput) {
  const now = new Date().toISOString();
  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return transaction;
}

// read
export async function getTransactionById(id: TRANSACTION_SELECT['id']) {
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.id, id))
    .limit(1);

  return rows[0] ?? null;
}

type TransactionSortBy = 'transactionDate' | 'createdAt';

export async function getTransactionsByBudgetId(
  budgetId: TRANSACTION_SELECT['budgetId'],
  limit?: number,
  sortBy: TransactionSortBy = 'transactionDate'
) {
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error('Transaction limit must be a positive integer.');
  }

  const orderColumn =
    sortBy === 'createdAt' ? transactionsTable.createdAt : transactionsTable.transactionDate;

  const query = db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.budgetId, budgetId))
    .orderBy(desc(orderColumn), desc(transactionsTable.createdAt));

  return limit === undefined ? query : query.limit(limit);
}

// Transactions created by this user across all budgets.
export async function getTransactionsByUserId(userId: TRANSACTION_SELECT['createdBy']) {
  return await db.select().from(transactionsTable).where(eq(transactionsTable.createdBy, userId));
}

export type TRANSACTION_CHANGES = Partial<
  Pick<
    TRANSACTION_INSERT,
    | 'budgetId'
    | 'amount'
    | 'title'
    | 'description'
    | 'originalCurrency'
    | 'transactionType'
    | 'paymentMethod'
    | 'transactionDate'
  >
>;

// update
export async function updateTransactionById(
  id: TRANSACTION_SELECT['id'],
  changes: TRANSACTION_CHANGES
) {
  const [transaction] = await db
    .update(transactionsTable)
    .set({ ...changes, updatedAt: new Date().toISOString() })
    .where(eq(transactionsTable.id, id))
    .returning();

  return transaction ?? null;
}

// delete
export async function deleteTransactionById(id: TRANSACTION_SELECT['id']) {
  const [deletedTransaction] = await db
    .delete(transactionsTable)
    .where(eq(transactionsTable.id, id))
    .returning({ id: transactionsTable.id });

  return deletedTransaction?.id ?? null;
}

// get amounts of all the transactions of a budget grouped by transaction currencies
export type BudgetTransactionTotals = {
  currency: TRANSACTION_SELECT['originalCurrency'];
  total: number;
  income: number;
  expense: number;
};

export async function getTransactionTotalsByBudgetId(
  budgetId: TRANSACTION_SELECT['budgetId']
): Promise<BudgetTransactionTotals[]> {
  const transactions = await getTransactionsByBudgetId(budgetId);

  const totals = new Map<BudgetTransactionTotals['currency'], BudgetTransactionTotals>();

  for (const transaction of transactions) {
    const currency = transaction.originalCurrency;

    if (!totals.has(currency)) {
      totals.set(currency, {
        currency,
        total: 0,
        income: 0,
        expense: 0,
      });
    }

    const summary = totals.get(currency)!;
    const amount = Number(transaction.amount);

    if (transaction.transactionType === 'income') {
      summary.income += amount;
    } else if (transaction.transactionType === 'expense') {
      summary.expense += amount;
    }

    summary.total = summary.income - summary.expense;
  }

  return Array.from(totals.values());
}
