// =============================================================
// POST /api/password/forgot  { email }
// -------------------------------------------------------------
// Issues a password-reset link. ALWAYS responds 200 with the same
// message whether or not the email exists — no account enumeration.
// A light per-user throttle prevents email flooding.
// =============================================================

import { NextResponse } from "next/server";
import dbConnect from "../../../../../utils/dbConnect";
import User from "../../../../../models/User";
import PasswordResetToken, {
  RESET_TOKEN_TTL_MIN,
} from "../../../../../models/PasswordResetToken";
import { sendPasswordResetEmail } from "../../../../../utils/email";

const THROTTLE_MS = 60 * 1000; // don't issue a second link within 60s
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same body for every outcome (no enumeration).
const GENERIC = {
  ok: true,
  message:
    "If an account exists for that email, we've sent a password reset link.",
};

export async function POST(request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email || "").trim().toLowerCase();
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Basic shape check — still generic to the client.
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(GENERIC);
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });

    // Only active users get a link; failures stay silent to the client.
    if (user && user.status === "active") {
      const recent = await PasswordResetToken.findOne({ user: user._id }).sort({
        createdAt: -1,
      });
      const throttled =
        recent &&
        !recent.usedAt &&
        Date.now() - recent.createdAt.getTime() < THROTTLE_MS;

      if (!throttled) {
        // Clear any prior unused tokens, then issue one fresh token.
        await PasswordResetToken.deleteMany({ user: user._id, usedAt: null });
        const rawToken = await PasswordResetToken.createForUser(user._id);

        const origin = new URL(request.url).origin;
        const resetUrl = `${origin}/reset-password?token=${rawToken}`;

        try {
          await sendPasswordResetEmail({
            to: user.email,
            name: user.name,
            resetUrl,
            ttlMinutes: RESET_TOKEN_TTL_MIN,
          });
        } catch (mailErr) {
          // Log server-side; never surface (would leak existence + break UX).
          console.error("[password/forgot] email send failed:", mailErr.message);
        }
      }
    }
  } catch (err) {
    console.error("[password/forgot] error:", err.message);
    // Still return the generic success to avoid leaking anything.
  }

  return NextResponse.json(GENERIC);
}
