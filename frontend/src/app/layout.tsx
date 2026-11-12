import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudentHub | Student Management",
  description: "Modern student registration and management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
