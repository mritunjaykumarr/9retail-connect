import ForgotPasswordView from "../../../components/auth/ForgotPasswordView";

export const metadata = {
  title: "Forgot password · RetailConnect SIP",
  description: "Request a link to reset your RetailConnect SIP password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
