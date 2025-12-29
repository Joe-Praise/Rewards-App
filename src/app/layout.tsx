import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "@/lib/query/queryClient";
import { AppNavigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowwa - Rewards Hub",
  description: "Earn points, unlock rewards, and celebrate your progress!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientWrapper>
          <AppNavigation>
            {children}
          </AppNavigation>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
