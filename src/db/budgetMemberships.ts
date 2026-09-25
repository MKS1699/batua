import { eq } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { db } from './client';
import { budgetMembershipsTable } from './schema';

export type BUDGET_MEMBERSHIP_INSERT = typeof budgetMembershipsTable.$inferInsert;
export type BUDGET_MEMBERSHIP_SELECT = typeof budgetMembershipsTable.$inferSelect;

// CRUD

// create
export type CreateBudgetMembershipInput = Omit<
  BUDGET_MEMBERSHIP_INSERT,
  'id' | 'createdAt' | 'updatedAt'
>;

export async function createNewBudgetMembership(input: CreateBudgetMembershipInput) {
  const now = new Date().toISOString();
  const [budgetMembership] = await db
    .insert(budgetMembershipsTable)
    .values({
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return budgetMembership;
}

// read
export async function getBudgetMembershipById(id: BUDGET_MEMBERSHIP_SELECT['id']) {
  const rows = await db
    .select()
    .from(budgetMembershipsTable)
    .where(eq(budgetMembershipsTable.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function getBudgetMembershipsByBudgetId(
  budgetId: BUDGET_MEMBERSHIP_SELECT['budgetId']
) {
  return await db
    .select()
    .from(budgetMembershipsTable)
    .where(eq(budgetMembershipsTable.budgetId, budgetId));
}

export async function getBudgetMembershipsByUserId(
  userId: BUDGET_MEMBERSHIP_SELECT['userId']
) {
  return await db
    .select()
    .from(budgetMembershipsTable)
    .where(eq(budgetMembershipsTable.userId, userId));
}

export type BUDGET_MEMBERSHIP_CHANGES = Partial<Pick<BUDGET_MEMBERSHIP_INSERT, 'role'>>;

// update
export async function updateBudgetMembershipById(
  id: BUDGET_MEMBERSHIP_SELECT['id'],
  changes: BUDGET_MEMBERSHIP_CHANGES
) {
  const [budgetMembership] = await db
    .update(budgetMembershipsTable)
    .set({ ...changes, updatedAt: new Date().toISOString() })
    .where(eq(budgetMembershipsTable.id, id))
    .returning();

  return budgetMembership ?? null;
}

// delete
export async function deleteBudgetMembershipById(id: BUDGET_MEMBERSHIP_SELECT['id']) {
  const [deletedBudgetMembership] = await db
    .delete(budgetMembershipsTable)
    .where(eq(budgetMembershipsTable.id, id))
    .returning({ id: budgetMembershipsTable.id });

  return deletedBudgetMembership?.id ?? null;
}
