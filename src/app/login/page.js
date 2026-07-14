import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in · RetailConnect SIP",
  description: "Sign in to RetailConnect SIP — field sales & distribution.",
};

// BYPASSED for frontend prototype — redirect straight to distributor portal
export default async function LoginPage() {
  redirect("/distributor");
}
