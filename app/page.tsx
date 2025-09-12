"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, TrendingUp, Coins, Crown, Smartphone, Laptop, Home, Car } from "lucide-react"

interface BTCPrice {
  usd: number
  usd_24h_change: number
}

interface ComparisonItem {
  name: string
  price: number
  icon: React.ReactNode
  unit: string
  dynasty?: string
  years?: number
}

export default function SatoshiSimulator() {
  const [btcPrice, setBtcPrice] = useState<BTCPrice>({ usd: 100000, usd_24h_change: 2.5 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // 中本聪估计持有的BTC数量（约100万枚）
  const satoshiBTC = 1000000
  const satoshiAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
        )
        const data = await response.json()
        setBtcPrice({
          usd: data.bitcoin.usd,
          usd_24h_change: data.bitcoin.usd_24h_change,
        })
      } catch (error) {
        console.log("使用模拟价格数据")
      } finally {
        setLoading(false)
      }
    }

    fetchBTCPrice()
    const interval = setInterval(fetchBTCPrice, 30000) // 每30秒更新一次

    return () => clearInterval(interval)
  }, [])

  const totalValue = satoshiBTC * btcPrice.usd

  const comparisonItems: ComparisonItem[] = [
    {
      name: "iPhone 15 Pro Max",
      price: 1199,
      icon: <Smartphone className="w-6 h-6" />,
      unit: "台",
      dynasty: "乾隆中期",
      years: 275,
    },
    {
      name: "MacBook Pro",
      price: 2499,
      icon: <Laptop className="w-6 h-6" />,
      unit: "台",
      dynasty: "顺治十二年",
      years: 370,
    },
    {
      name: "特斯拉Model S",
      price: 89990,
      icon: <Car className="w-6 h-6" />,
      unit: "辆",
      dynasty: "明朝崇祯",
      years: 395,
    },
    {
      name: "北京四合院",
      price: 50000000,
      icon: <Home className="w-6 h-6" />,
      unit: "套",
      dynasty: "唐朝贞观",
      years: 1400,
    },
    {
      name: "黄金（1盎司）",
      price: 2000,
      icon: <Crown className="w-6 h-6" />,
      unit: "盎司",
      dynasty: "康熙年间",
      years: 340,
    },
  ]

  const copyAddress = () => {
    navigator.clipboard.writeText(satoshiAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K"
    return Math.floor(num).toLocaleString()
  }

  const getCurrentYear = () => new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* 飘落的比特币动画 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl money-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            ₿
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl bitcoin-bounce">₿</div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              中本聪财富模拟器
            </h1>
            <div className="text-6xl bitcoin-bounce" style={{ animationDelay: "0.5s" }}>
              💰
            </div>
          </div>
          <p className="text-xl text-muted-foreground mb-4">让你直观感受比特币创始人的惊人财富！</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            实时数据 · 魔性对比 · 传播必备
          </Badge>
        </div>

        {/* 中本聪地址卡片 */}
        <Card className="mb-8 pulse-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-primary" />
              中本聪的比特币地址
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono break-all">{satoshiAddress}</code>
              <Button variant="outline" size="sm" onClick={copyAddress} className="shrink-0 bg-transparent">
                <Copy className="w-4 h-4" />
                {copied ? "已复制!" : "复制"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 实时资产价值 */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="w-8 h-8 text-primary" />
              中本聪当前总资产
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{satoshiBTC.toLocaleString()} BTC</div>
                <div className="text-sm text-muted-foreground">持有数量</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">${formatNumber(totalValue)}</div>
                <div className="text-sm text-muted-foreground">当前价值 (${btcPrice.usd.toLocaleString()}/BTC)</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-2 ${btcPrice.usd_24h_change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {btcPrice.usd_24h_change >= 0 ? "+" : ""}
                  {btcPrice.usd_24h_change.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">24小时涨跌</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 物品对比区域 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">🤯 中本聪的钱能买多少东西？</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonItems.map((item, index) => {
              const quantity = Math.floor(totalValue / item.price)
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-card to-muted/30"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">{item.icon}</div>
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{formatNumber(quantity)}</div>
                      <div className="text-lg text-muted-foreground mb-3">{item.unit}</div>
                      <Separator className="my-3" />
                      <div className="text-sm text-muted-foreground">单价: ${item.price.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 历史时间线对比 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">⏰ 如果从古代开始花钱...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonItems.slice(0, 4).map((item, index) => {
              const quantity = Math.floor(totalValue / item.price)
              const yearsToSpend = Math.floor((quantity * (item.years || 5)) / 365)
              const startYear = getCurrentYear() - yearsToSpend

              return (
                <Card key={index} className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg text-accent">{item.icon}</div>
                      {item.name} 使用寿命计算
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">可购买数量:</span>
                        <span className="font-bold text-primary">
                          {formatNumber(quantity)} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">单个使用寿命:</span>
                        <span className="font-bold">{item.years || 5} 年</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">总使用时间:</span>
                        <span className="font-bold text-accent">{formatNumber(yearsToSpend)} 年</span>
                      </div>
                      <Separator />
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-accent mb-2">从 {item.dynasty || "远古时代"} 开始</div>
                        <div className="text-sm text-muted-foreground">
                          约 {startYear > 0 ? `公元${startYear}年` : `公元前${Math.abs(startYear)}年`}
                          {" → "}
                          {getCurrentYear()}年 (现在)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 搞笑总结 */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">🤑</div>
            <h3 className="text-2xl font-bold mb-4">总结：中本聪真的是...</h3>
            <div className="text-xl text-muted-foreground mb-6 space-y-2">
              <p>
                💰 拥有价值 <span className="font-bold text-primary">${formatNumber(totalValue)}</span> 的比特币
              </p>
              <p>🏰 可以买下整个朝代的GDP</p>
              <p>👑 比古代皇帝还要富有</p>
              <p>🚀 财富增长速度超越火箭</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() =>
                  window.open(
                    "https://twitter.com/intent/tweet?text=" +
                      encodeURIComponent(
                        `🤯 中本聪现在的财富价值 $${formatNumber(totalValue)}！可以买 ${formatNumber(Math.floor(totalValue / 1199))} 台iPhone！从古代花到现在都花不完！#比特币 #中本聪 #财富模拟器`,
                      ),
                    "_blank",
                  )
                }
              >
                分享到推特 🐦
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                刷新数据 🔄
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 页脚 */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>数据来源: CoinGecko API | 中本聪BTC数量为估算值</p>
          <p className="mt-2">⚠️ 本工具仅供娱乐，不构成投资建议</p>
        </div>
      </div>
    </div>
  )
}
