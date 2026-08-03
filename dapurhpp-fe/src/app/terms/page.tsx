import type { Metadata } from "next";
import TermsClient from "./terms-client";

export const metadata: Metadata = {
  title: "Terms & Conditions — DapurHPP",
  description:
    "Kelola master data bahan baku dan harga untuk perhitungan HPP otomatis.",
};

export default function TermsAndConditionsPage() {
  return <TermsClient />;
}
