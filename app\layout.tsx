import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alina Li — AI 视觉设计师",
    template: "%s — Alina Li",
  },
  description: "AI 视觉设计师 Alina Li 的个人作品集：将智能能力转化为清晰、有温度的视觉与体验。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
