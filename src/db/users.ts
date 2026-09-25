import { asc, eq } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { db } from './client';
import { usersTable } from './schema';

export type USER_INSERT = typeof usersTable.$inferInsert;
export type USER_SELECT = typeof usersTable.$inferSelect;

// CRUD

// create
export type CreateUserInput = Omit<USER_INSERT, 'id' | 'createdAt' | 'updatedAt'>;
export async function createNewUser(input: CreateUserInput) {
  const now = new Date().toISOString();
  const [user] = await db
    .insert(usersTable)
    .values({
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return user;
}

// read
export async function getAllUsers() {
  return await db
    .select()
    .from(usersTable)
    .orderBy(asc(usersTable.createdAt), asc(usersTable.id));
}

// The earliest-created profile is the local user for the single-user MVP.
export async function getLocalUser() {
  const [user] = await db
    .select()
    .from(usersTable)
    .orderBy(asc(usersTable.createdAt), asc(usersTable.id))
    .limit(1);

  return user ?? null;
}

export async function getUserById(id: USER_SELECT['id']) {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

  return users[0] ?? null;
}

export type USER_CHANGES = Partial<Pick<USER_INSERT, 'name' | 'email' | 'phone'>>;

// update
export async function updateUserById(id: USER_SELECT['id'], changes: USER_CHANGES) {
  const [user] = await db
    .update(usersTable)
    .set({ ...changes, updatedAt: new Date().toISOString() })
    .where(eq(usersTable.id, id))
    .returning();

  return user ?? null;
}

// delete
export async function deleteUserById(id: USER_SELECT['id']) {
  const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning({
    id: usersTable.id,
  });

  return deletedUser?.id ?? null;
}
