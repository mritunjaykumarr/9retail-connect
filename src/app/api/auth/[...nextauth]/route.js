// NextAuth v5 route handler — exposes /api/auth/* (signin, callback,
// session, csrf, signout). Node runtime because the Credentials provider
// touches Mongoose + bcrypt.
import { handlers } from "../../../../../auth";

export const { GET, POST } = handlers;
