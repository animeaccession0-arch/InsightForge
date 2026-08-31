import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, datasets, inspections, analyses, reviews } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach(field => {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function saveDataset(record: typeof datasets.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(datasets).values(record);
  return result;
}

export async function saveInspection(record: typeof inspections.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(inspections).values(record);
}

export async function saveAnalysis(record: typeof analyses.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(analyses).values(record);
}

export async function saveReview(record: typeof reviews.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(reviews).values(record);
}

export async function listReviews(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(reviews.createdAt).limit(limit);
}
