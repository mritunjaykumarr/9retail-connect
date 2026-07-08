// =============================================================
// Demo user seeding — one active user per role so the login flow and
// the role-aware shell can be exercised end-to-end in development.
// Idempotent: skips users that already exist. Passwords are hashed by
// the User model's pre-save hook.
// =============================================================

import dbConnect from "./dbConnect";
import User from "../models/User";
import { ROLES } from "../lib/roles";

// Shared demo password (dev only). Meets the model's 8–72 char rule.
export const DEMO_PASSWORD = "RetailConnect#1";

function avatarFor(name) {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundType=gradientLinear&fontWeight=600`;
}

const SEED_USERS = [
  { role: ROLES.SALES_OFFICER, name: "Rahul Mehta", email: "so@retailconnect.io" },
  { role: ROLES.AREA_MANAGER, name: "Priya Nair", email: "manager@retailconnect.io" },
  { role: ROLES.REGIONAL, name: "Arjun Rao", email: "regional@retailconnect.io" },
  { role: ROLES.DISTRIBUTOR_ADMIN, name: "Sunil Agarwal", email: "distributor@retailconnect.io" },
  { role: ROLES.MANAGEMENT, name: "Kavita Desai", email: "management@retailconnect.io" },
  { role: ROLES.PLANT_HEAD, name: "Vikram Iyer", email: "plant@retailconnect.io" },
  { role: ROLES.SYSTEM_ADMIN, name: "Neha Kulkarni", email: "admin@retailconnect.io" },
];

export async function seedUsers() {
  await dbConnect();
  const results = [];

  for (const u of SEED_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      results.push({ email: u.email, role: u.role, status: "exists" });
      continue;
    }
    await User.create({
      name: u.name,
      email: u.email,
      password: DEMO_PASSWORD,
      role: u.role,
      status: "active",
      avatarUrl: avatarFor(u.name),
    });
    results.push({ email: u.email, role: u.role, status: "created" });
  }

  return { password: DEMO_PASSWORD, users: results };
}
