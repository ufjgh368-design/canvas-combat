import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "西洋音樂家知識格鬥：Maestro Combat",
  description: "透過西洋音樂史問答發動招式，與 37 位作曲家展開知識格鬥 RPG。",
  openGraph: {
    title: "西洋音樂家知識格鬥：Maestro Combat",
    description: "旋律是招式，節奏是連擊，知識就是最強樂章。",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "西洋音樂家知識格鬥：Maestro Combat",
    description: "旋律是招式，節奏是連擊，知識就是最強樂章。",
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
