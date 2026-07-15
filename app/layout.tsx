import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西洋藝術大亂鬥：Canvas Combat",
  description: "透過藝術史問答發動招式的西洋藝術家知識格鬥 RPG。",
  openGraph: {
    title: "西洋藝術大亂鬥：Canvas Combat",
    description: "知識是你的武器，畫布就是競技場。",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "西洋藝術大亂鬥：Canvas Combat",
    description: "知識是你的武器，畫布就是競技場。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

