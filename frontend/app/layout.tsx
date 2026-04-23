import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoTest UI Inspector",
  description: "SaaS dashboard for UI inspection and automated test runs",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
