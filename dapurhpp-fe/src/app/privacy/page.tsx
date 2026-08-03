import type { Metadata } from "next";
import PrivacyClient from "./privacy-client";

export const metadata: Metadata = {
  title: "Privacy Policy — DapurHPP",
  description:
    "Kebijakan privasi DapurHPP untuk melindungi data bisnis kuliner Anda.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
