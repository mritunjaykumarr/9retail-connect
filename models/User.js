// =============================================================
// RetailConnect SIP — User model (Mongoose)
// -------------------------------------------------------------
// The identity + RBAC record for every person who signs in. Roles are
// imported from lib/roles.js so the database enum and the app shell's
// navigation/guards never drift apart. Passwords are bcrypt-hashed and
// never returned by default (`select: false`).
//
// Spec: docs/PROJECT.md §3 (Users & roles), §8 (Data model), §10 (Security).
// =============================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../lib/roles";

const { Schema } = mongoose;

// Cost factor for bcrypt. 12 is a strong, widely-used default that stays
// well within serverless CPU budgets.
const SALT_ROUNDS = 12;

// bcrypt only considers the first 72 BYTES of input; anything longer is
// silently ignored, which would make long passwords misleadingly weak.
// We reject over-long passwords instead of silently truncating.
const BCRYPT_MAX_BYTES = 72;

// Reasonably strict email shape (full RFC validation is intentionally not
// attempted — real deliverability is verified out of band).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Allow only http(s) absolute URLs for avatars.
const URL_RE = /^https?:\/\/[^\s]+$/i;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters."],
      maxlength: [80, "Name must be at most 80 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email must be at most 254 characters."],
      match: [EMAIL_RE, "Please provide a valid email address."],
    },

    // Stored as a bcrypt hash. `select: false` keeps it out of every query
    // result unless a caller explicitly asks for it (`.select("+password")`),
    // e.g. the auth flow that calls comparePassword().
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
      // Length constraints apply to the RAW password: Mongoose runs
      // validation BEFORE the pre('save') hashing hook, so these bound the
      // user-supplied value at set-time. A bcrypt hash (~60 chars) also sits
      // comfortably inside this range, so re-validating an already-hashed
      // doc never fails.
      minlength: [8, "Password must be at least 8 characters."],
      maxlength: [72, "Password must be at most 72 characters."],
    },

    role: {
      type: String,
      required: [true, "Role is required."],
      // Single source of truth — the 7 roles from lib/roles.js.
      enum: {
        values: Object.values(ROLES),
        message: "`{VALUE}` is not a valid role.",
      },
      index: true,
    },

    // Territory scoping (docs/PROJECT.md §3: access is territory-scoped).
    // Optional: Management / System Admin can be national with no single
    // territory. The Territory model is added in a later task; the ref
    // resolves at populate-time, so declaring it now is safe.
    territory: {
      type: Schema.Types.ObjectId,
      ref: "Territory",
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "`{VALUE}` is not a valid status.",
      },
      default: "active",
      index: true,
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: (v) => v == null || v === "" || URL_RE.test(v),
        message: "Avatar must be a valid http(s) URL.",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        // Never expose the hash or internal version key.
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ---- Password hashing --------------------------------------------------

/**
 * Hash a raw password, rejecting input that exceeds bcrypt's 72-byte window
 * (so we never silently weaken a long password).
 */
async function hashPassword(raw) {
  if (Buffer.byteLength(raw, "utf8") > BCRYPT_MAX_BYTES) {
    throw new Error(
      `Password must be at most ${BCRYPT_MAX_BYTES} bytes for bcrypt.`
    );
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(raw, salt);
}

// Hash on create / document .save() — only when the password actually changed.
// Mongoose 9 removed the `next` callback: pre middleware is async/promise-based,
// so we just await and let thrown errors propagate.
userSchema.pre("save", async function hashOnSave() {
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password);
});

// Hash when a password is set through an update query. Without this,
// findOneAndUpdate/updateOne would store the raw password unhashed.
async function hashOnUpdate() {
  const update = this.getUpdate();
  if (!update) return;

  // Support both `{ password }` and `{ $set: { password } }` shapes.
  const direct = Object.prototype.hasOwnProperty.call(update, "password")
    ? "password"
    : null;
  const inSet =
    update.$set &&
    Object.prototype.hasOwnProperty.call(update.$set, "password")
      ? "$set.password"
      : null;

  const raw = direct ? update.password : inSet ? update.$set.password : null;
  if (raw == null) return;

  const hashed = await hashPassword(raw);
  if (direct) {
    update.password = hashed;
  } else {
    update.$set.password = hashed;
  }
  this.setUpdate(update);
}
userSchema.pre("findOneAndUpdate", hashOnUpdate);
userSchema.pre("updateOne", hashOnUpdate);
userSchema.pre("updateMany", hashOnUpdate);

// ---- Instance methods --------------------------------------------------

/**
 * Compare a candidate plaintext password against the stored hash.
 * The document must have been loaded WITH the password field, e.g.
 * `User.findOne({ email }).select("+password")`.
 */
userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) {
    throw new Error(
      "Password not loaded — select it explicitly with .select('+password')."
    );
  }
  return bcrypt.compare(candidate, this.password);
};

// Reuse the compiled model across hot reloads / serverless invocations.
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
