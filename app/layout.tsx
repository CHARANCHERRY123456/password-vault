
import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Password Vault",
  description: "Password Vault",
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}