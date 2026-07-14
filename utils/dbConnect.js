// =============================================================
// dbConnect — BYPASSED for frontend prototype
// -------------------------------------------------------------
// Original required MONGODB_URI and threw if missing.
// Now a no-op so the app can start without any database.
// =============================================================

async function dbConnect() {
  // No-op: no database connection needed for frontend prototype
  return null;
}

export default dbConnect;
