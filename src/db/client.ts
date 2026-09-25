import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const sqlite = openDatabaseSync('expense-tracker.db');
sqlite.execSync('PRAGMA foreign_keys = ON');

export const db = drizzle(sqlite);
