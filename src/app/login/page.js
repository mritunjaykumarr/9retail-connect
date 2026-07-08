import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import LoginView from "../../../components/auth/LoginView";

export const metadata = {
  title: "Sign in · RetailConnect SIP",
  description: "Sign in to RetailConnect SIP — field sales & distribution.",
};

export default async function LoginPage({ searchParams }) {
  // Already signed in → skip the form. (Middleware also guards this.)
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const sp = (await searchParams) || {};
  const raw = typeof sp.callbackUrl === "string" ? sp.callbackUrl : "/dashboard";
  // Only allow internal callback paths (never an open redirect).
  const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  return <LoginView callbackUrl={callbackUrl} />;
}
