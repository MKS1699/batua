import { eq } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { db } from './client';
import { budgetsTable } from './schema';

export type BUDGET_INSERT = typeof budgetsTable.$inferInsert;
export type BUDGET_SELECT = typeof budgetsTable.$inferSelect;

// CRUD

// create
export type CreateBudgetInput = Omit<BUDGET_INSERT, 'id' | 'createdAt' | 'updatedAt'>;

export async function createNewBudget(input: CreateBudgetInput) {
  const now = new Date().toISOString();
  const [budget] = await db
    .insert(budgetsTable)
    .values({
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return budget;
}

// read
export async function getBudgetById(id: BUDGET_SELECT['id']) {
  const rows = await db
    .select()
    .from(budgetsTable)
    .where(eq(budgetsTable.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function getBudgetsByOwnerId(ownerId: BUDGET_SELECT['ownerId']) {
  return await db.select().from(budgetsTable).where(eq(budgetsTable.ownerId, ownerId));
}

export type BUDGET_CHANGES = Partial<
  Pick<
    BUDGET_INSERT,
    | 'name'
    | 'description'
    | 'ownerId'
    | 'period'
    | 'startDate'
    | 'endDate'
    | 'currency'
    | 'isShareable'
  >
>;

// update
export async function updateBudgetById(id: BUDGET_SELECT['id'], changes: BUDGET_CHANGES) {
  const [budget] = await db
    .update(budgetsTable)
    .set({ ...changes, updatedAt: new Date().toISOString() })
    .where(eq(budgetsTable.id, id))
    .returning();

  return budget ?? null;
}

// delete
export async function deleteBudgetById(id: BUDGET_SELECT['id']) {
  const [deletedBudget] = await db
    .delete(budgetsTable)
    .where(eq(budgetsTable.id, id))
    .returning({ id: budgetsTable.id });

  return deletedBudget?.id ?? null;
}
