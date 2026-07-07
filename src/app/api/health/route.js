import mongoose from "mongoose";
import dbConnect from "../../../../utils/dbConnect";

// Never statically cache this route — it must run on every request.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // Lightweight round-trip to confirm the database is actually reachable,
    // not just that a connection object exists.
    await mongoose.connection.db.admin().ping();

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[health] Database health check failed:", error);

    return Response.json(
      { ok: false, error: "Database unreachable" },
      { status: 503 }
    );
  }
}
