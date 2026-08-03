import type { Metadata } from "next";
import ForgotPasswordClient from "./forgot-password-client";

export const metadata: Metadata = {
  title: "Forgot Password — DapurHPP",
  description:
    "Atur ulang kata sandi akun DapurHPP Anda.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
