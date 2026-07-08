import dbConnect from "../../../utils/dbConnect";
import PasswordResetToken from "../../../models/PasswordResetToken";
import ResetPasswordView from "../../../components/auth/ResetPasswordView";

export const metadata = {
  title: "Reset password · RetailConnect SIP",
  description: "Set a new password for your RetailConnect SIP account.",
};

export default async function ResetPasswordPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const token = typeof sp.token === "string" ? sp.token : "";

  // Pre-validate server-side so an expired/used link shows the right state
  // immediately (the API re-validates on submit as defense in depth).
  let tokenValid = false;
  if (token) {
    try {
      await dbConnect();
      const doc = await PasswordResetToken.findValidByToken(token);
      tokenValid = !!doc;
    } catch (e) {
      tokenValid = false;
    }
  }

  return <ResetPasswordView token={token} tokenValid={tokenValid} />;
}
