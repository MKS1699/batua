import { eq } from 'drizzle-orm';
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

export async function getTransactionsByBudgetId(budgetId: TRANSACTION_SELECT['budgetId']) {
  return await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.budgetId, budgetId));
}

// Transactions created by this user across all budgets.
export async function getTransactionsByUserId(userId: TRANSACTION_SELECT['createdBy']) {
  return await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.createdBy, userId));
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
