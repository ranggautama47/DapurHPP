import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/components/provider/loading-provider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DapurHPP",
  description: "Masuk ke   DapurHPP untuk mengelola bisnis kuliner Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${beVietnam.variable} ${robotoMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FFF8F6]">
        <LoadingProvider>
          {children}
        </LoadingProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "24px",
              border: "1px solid #DDC1AE",
              fontSize: "14px",
              fontFamily: "var(--font-be-vietnam)",
            },
            duration: 4000,
          }}
          richColors
        />
      </body>
    </html>
  );
}