import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to your .env.local file."
  );
}

/**
 * Cache the Mongoose connection on the Node.js `global` object.
 *
 * In the Next.js App Router, route handlers can run in a long-lived server
 * process (dev, Node runtime) where module state is reused, and hot-reload in
 * development re-evaluates modules on every change. Without this cache we would
 * open a brand new connection on every request / reload and quickly exhaust the
 * database's connection pool. Storing the connection (and the in-flight connect
 * promise) on `global` guarantees a single shared connection is reused across
 * requests and survives hot reloads.
 */
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Reuse an already-established connection.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already being established, await the same promise
  // instead of starting a second one (handles concurrent requests).
  if (!cached.promise) {
    const opts = {
      // Fail fast instead of buffering queries forever when disconnected.
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so the next call can retry the connection.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
