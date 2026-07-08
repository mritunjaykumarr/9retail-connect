// =============================================================
// RetailConnect SIP — PasswordResetToken model
// -------------------------------------------------------------
// A time-limited, single-use password-reset token. SECURITY: we store
// only the SHA-256 HASH of the token, never the raw value — the raw
// token exists only in the emailed link, so a DB leak can't be used to
// reset anyone's password. Expired docs are auto-purged by a TTL index.
//
// Spec: docs/PROJECT.md §10 (Security).
// =============================================================

import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

export const RESET_TOKEN_TTL_MIN = 60; // link lifetime, in minutes

/** SHA-256 of a raw token — what we store and look up by. */
export function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw)).digest("hex");
}

const passwordResetTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// TTL index: MongoDB removes each doc shortly after it expires. (We also
// check expiry explicitly on lookup, since TTL sweeps only run ~1/min.)
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Issue a fresh token for a user. Stores the hash, returns the RAW token
 * (email this — it is never persisted).
 */
passwordResetTokenSchema.statics.createForUser = async function createForUser(userId) {
  const raw = crypto.randomBytes(32).toString("hex");
  await this.create({
    user: userId,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MIN * 60 * 1000),
  });
  return raw;
};

/** Return the token doc if the raw token is known, unused and unexpired. */
passwordResetTokenSchema.statics.findValidByToken = async function findValidByToken(raw) {
  if (!raw || typeof raw !== "string") return null;
  const doc = await this.findOne({ tokenHash: hashToken(raw) });
  if (!doc) return null;
  if (doc.usedAt) return null;
  if (doc.expiresAt.getTime() < Date.now()) return null;
  return doc;
};

const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
