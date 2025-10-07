
import "./globals.css";
import type { Metadata } from "next";
import {Inter} from "next/font/google";

import Providers from "./providers";
import LogoutButton from "@/components/Logout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Password Vault",
  description: "Password Vault",
};

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-row-reverse p-4">
            <LogoutButton />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}