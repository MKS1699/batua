import { eq } from 'drizzle-orm';
import { db } from './client';
import { userPreferencesTable } from './schema';

export type USER_PREFERENCE_INSERT = typeof userPreferencesTable.$inferInsert;
export type USER_PREFERENCE_SELECT = typeof userPreferencesTable.$inferSelect;

// CRUD

// create
export async function createUserPreference(input: USER_PREFERENCE_INSERT) {
  const [userPreference] = await db
    .insert(userPreferencesTable)
    .values({
      ...input,
    })
    .returning();

  return userPreference;
}

// get user preference by userId
export async function getUserPreference(userId: USER_PREFERENCE_SELECT['userId']) {
  const [userPreference] = await db
    .select()
    .from(userPreferencesTable)
    .where(eq(userPreferencesTable.userId, userId))
    .limit(1);

  return userPreference ?? null;
}

// update user preferences by userId
type USER_PREFERENCE_CHANGES = Partial<Pick<USER_PREFERENCE_INSERT, 'defaultBudgetId'>>;
export async function updateUserPreference(
  userId: USER_PREFERENCE_SELECT['userId'],
  changes: USER_PREFERENCE_CHANGES
) {
  const [userPreference] = await db
    .update(userPreferencesTable)
    .set({ ...changes })
    .where(eq(userPreferencesTable.userId, userId))
    .returning();

  return userPreference ?? null;
}

// delete user preference by userId
export async function deleteUserPreference(userId: USER_PREFERENCE_SELECT['userId']) {
  const [deletedPreference] = await db
    .delete(userPreferencesTable)
    .where(eq(userPreferencesTable.userId, userId))
    .returning({ userId: userPreferencesTable.userId });

  return deletedPreference?.userId ?? null;
}
