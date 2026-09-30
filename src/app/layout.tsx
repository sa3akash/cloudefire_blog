import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CloudBlog | Production Next.js on Cloudflare Free Tier",
    template: "%s | CloudBlog",
  },
  description:
    "A high-performance editorial publication platform engineered to run entirely on Cloudflare Workers, D1 database, and R2 media storage with zero egress charges.",
  keywords: [
    "Next.js",
    "Cloudflare Workers",
    "Cloudflare D1",
    "Cloudflare R2",
    "Serverless",
    "Web Performance",
    "Edge Computing",
  ],
  authors: [{ name: "CloudBlog Editorial" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
