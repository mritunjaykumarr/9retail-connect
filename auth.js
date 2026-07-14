// =============================================================
// Auth.js — BYPASSED for frontend prototype
// -------------------------------------------------------------
// Original used NextAuth with Credentials provider + MongoDB.
// Now exports no-op stubs so any import of auth.js won't crash.
// =============================================================

export const handlers = {
  GET: (req) => new Response("Auth bypassed", { status: 200 }),
  POST: (req) => new Response("Auth bypassed", { status: 200 }),
};

export async function auth() {
  return {
    user: {
      id: "mock-distributor-admin",
      name: "Arkalal Chakravarty",
      email: "arkalal@distributor.com",
      role: "distributor_admin",
    },
  };
}

export async function signIn() {
  return true;
}

export async function signOut() {
  return true;
}
