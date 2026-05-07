import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import type { Metadata } from "next";

import AppNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pulse Gallery",
  description: "Cloud-Native Multimedia Sharing Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <AppNavbar />

        <main className="flex-grow-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}