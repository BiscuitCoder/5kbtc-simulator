import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "中本聪财富模拟器 - 比特币创始人资产实时计算器",
  description: "实时计算中本聪的比特币财富，换算成各种物品数量和历史时间线。幽默魔性，传播必备！",
  generator: "v0.app",
  keywords: ["中本聪", "比特币", "财富计算器", "BTC", "资产模拟器"],
  openGraph: {
    title: "中本聪财富模拟器",
    description: "看看比特币创始人的惊人财富能买多少东西！",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "中本聪财富模拟器",
    description: "实时计算中本聪的BTC财富，魔性对比各种物品！",
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
