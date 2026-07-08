// =============================================================
// RetailConnect SIP — Auth.js (NextAuth v5) full config
// -------------------------------------------------------------
// Node runtime. Adds the email/password Credentials provider that
// verifies against our Mongoose User model + bcrypt, and shapes the
// JWT/session so `role` and `avatar` travel with the session.
//
// Exports the handlers used by the /api/auth route, plus `auth`,
// `signIn`, `signOut` for server components / actions.
// =============================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import dbConnect from "./utils/dbConnect";
import User from "./models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // Shown fields are informational only — our /login page renders its own UI.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        await dbConnect();

        // Must explicitly select the password (schema hides it by default).
        const user = await User.findOne({ email }).select("+password");
        if (!user) return null;
        if (user.status !== "active") return null;

        const valid = await user.comparePassword(password);
        if (!valid) return null;

        // Returned object seeds the JWT (see jwt callback).
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatarUrl || null,
          territory: user.territory ? user.territory.toString() : null,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // On sign-in, copy our custom fields onto the token.
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.avatar = user.avatar || null;
        token.territory = user.territory ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid || null;
        session.user.role = token.role || null;
        session.user.avatar = token.avatar || null;
        session.user.territory = token.territory ?? null;
      }
      return session;
    },
  },
});
