import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "5KBTC模拟器 - 比特币投资时间机器",
  description: "用5千人民币在不同年份买入比特币，现在价值多少？穿越时空的投资模拟器！",
  generator: "v0.app",
  keywords: ["5KBTC", "比特币", "投资模拟器", "BTC", "时间机器", "收益率计算"],
  openGraph: {
    title: "5KBTC时间机器",
    description: "穿越时空看看5千人民币在不同年份买入比特币的惊人收益！",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "5KBTC投资时间机器",
    description: "5千人民币穿越时空买BTC，现在值多少钱？魔性投资模拟器！",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
