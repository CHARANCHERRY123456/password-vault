import "./globals.css";
import type { Metadata } from "next";

import {Inter} from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Password Vault",
  description: "Password Vault",
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en">
      <h1>Header</h1>
      <body className={inter.className}>{children}</body>
      <h1>Footer</h1>
    </html>
  );
}