import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppInitializer from "@/components/AppInitializer";
import Navbar from "@/components/Navbar";
import PetCompanion from "@/components/PetCompanion";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Check Chăm Chỉ",
  description: "Ứng dụng xây dựng kỷ luật mỗi ngày",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AppInitializer />
        <Navbar />
        <main className="max-w-7xl mx-auto">{children}</main>
        <PetCompanion />
      </body>
    </html>
  );
}