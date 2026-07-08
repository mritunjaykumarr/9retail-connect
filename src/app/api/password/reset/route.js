// =============================================================
// POST /api/password/reset  { token, password }
// -------------------------------------------------------------
// Validates a reset token (exists / unused / unexpired), sets the new
// password (the User model hashes it on save), then burns the token and
// invalidates any siblings. Generic errors only.
// =============================================================

import { NextResponse } from "next/server";
import dbConnect from "../../../../../utils/dbConnect";
import User from "../../../../../models/User";
import PasswordResetToken from "../../../../../models/PasswordResetToken";

export async function POST(request) {
  let token = "";
  let password = "";
  try {
    const body = await request.json();
    token = String(body?.token || "");
    password = String(body?.password || "");
  } catch (e) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "weak_password", message: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const tokenDoc = await PasswordResetToken.findValidByToken(token);
    if (!tokenDoc) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
    }

    const user = await User.findById(tokenDoc.user);
    if (!user) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
    }

    // Set + hash (pre-save hook) + validate (min/max length) via the model.
    user.password = password;
    await user.save();

    // Burn this token and invalidate any other outstanding tokens.
    tokenDoc.usedAt = new Date();
    await tokenDoc.save();
    await PasswordResetToken.deleteMany({ user: user._id, usedAt: null });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Surface only model validation messages (e.g. password too long); hide the rest.
    if (err?.name === "ValidationError") {
      const first = Object.values(err.errors)[0];
      return NextResponse.json(
        { ok: false, error: "weak_password", message: first?.message || "Invalid password." },
        { status: 400 }
      );
    }
    console.error("[password/reset] error:", err.message);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
