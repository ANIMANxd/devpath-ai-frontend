import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevPath AI - Your Developer Journey, Mapped by AI",
  description:
    "Unlock insights from your GitHub, get personalized career paths, and discover what makes you unique as a developer.",
  keywords: ["developer", "career", "AI", "GitHub", "analytics", "skills"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e1e2e",
              color: "#fff",
              border: "1px solid rgba(139, 92, 246, 0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
