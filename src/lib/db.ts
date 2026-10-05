import mongoose from "mongoose";

const globalForMongoose = global as typeof globalThis & {
  mongooseConnection?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const cache = globalForMongoose.mongooseConnection ?? { conn: null, promise: null };
globalForMongoose.mongooseConnection = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");

  cache.promise ??= mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
    bufferCommands: false
  });
  cache.conn = await cache.promise;
  return cache.conn;
}
