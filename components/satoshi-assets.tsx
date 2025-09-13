"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import CountUp from "react-countup"

interface BTCPrice {
  usd: number
  usd_24h_change: number
}

interface SatoshiAssetsProps {
  satoshiBTC: number
  satoshiAddress: string
}

export default function SatoshiAssets({ satoshiBTC, satoshiAddress }: SatoshiAssetsProps) {
  const [btcPrice, setBtcPrice] = useState<BTCPrice>({ usd: 100000, usd_24h_change: 0 })
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
            <span className="animate-pulse">加载中...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="w-8 h-8 text-primary" />
          中本聪当前总资产
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              <CountUp end={satoshiBTC} duration={2.5} separator="," />
              <span className="ml-1">BTC</span>
            </div>
            <div className="text-sm text-muted-foreground">持有数量</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              $<CountUp end={btcPrice.usd} duration={2} separator="," decimals={0} />
            </div>
            <div className="text-sm text-muted-foreground">BTC 当前价格</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              $<CountUp end={totalValue} duration={3} separator="," decimals={0} />
            </div>
            <div className="text-sm text-muted-foreground">总资产价值</div>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold mb-2 ${btcPrice.usd_24h_change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {btcPrice.usd_24h_change >= 0 ? "+" : ""}
              <CountUp end={btcPrice.usd_24h_change} duration={1.5} decimals={2} />%
            </div>
            <div className="text-sm text-muted-foreground">24小时涨跌</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
