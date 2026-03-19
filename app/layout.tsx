import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unimind Content",
  description: "Unimind content hub — blog, wiki, handbook, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
