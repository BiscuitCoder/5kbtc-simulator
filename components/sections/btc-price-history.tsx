"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import chartData from "@/lib/chart.json"

interface PriceData {
  year: number
  price: number
  change?: number
}

interface BitcoinPriceHistoryProps {
  className?: string
  selectedYear?: number | null
  onYearChange?: (year: number | null) => void
  onPriceDataChange?: (data: PriceData[]) => void
  defaultYear?: number
}

export default function BitcoinPriceHistory({ className, selectedYear, onYearChange, onPriceDataChange, defaultYear = 2014 }: BitcoinPriceHistoryProps) {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true)
        setError(null)

        // 从 chart.json 转换月度数据为年度数据
        const convertChartDataToYearly = () => {
          const timestamps = chartData[0].timestamp
          const closes = chartData[0].indicators.quote[0].close

          // 将数据按年份分组
          const yearlyData: { [year: number]: number[] } = {}

          timestamps.forEach((timestamp: number, index: number) => {
            const date = new Date(timestamp * 1000)
            const year = date.getFullYear()
            const closePrice = closes[index]

            if (!yearlyData[year]) {
              yearlyData[year] = []
            }
            yearlyData[year].push(closePrice)
          })

          // 计算每年的平均价格
          const historicalPrices: PriceData[] = Object.entries(yearlyData)
            .map(([year, prices]) => ({
              year: parseInt(year),
              price: Math.round((prices.reduce((sum, price) => sum + price, 0) / prices.length) * 100) / 100
            }))
            .sort((a, b) => a.year - b.year)

          return historicalPrices
        }

        const historicalPrices = convertChartDataToYearly()

        // 获取最新价格数据
        try {
          console.log("正在获取最新比特币价格...")
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
          )

          if (response.ok) {
            const data = await response.json()
            const fetchedCurrentPrice = data?.bitcoin?.usd

            if (fetchedCurrentPrice && fetchedCurrentPrice > 0) {
              setCurrentPrice(Math.round(fetchedCurrentPrice * 100) / 100)

              // 更新今年价格
              const currentYear = new Date().getFullYear()
              const currentYearIndex = historicalPrices.findIndex(item => item.year === currentYear)

              if (currentYearIndex >= 0) {
                historicalPrices[currentYearIndex].price = Math.round(fetchedCurrentPrice * 100) / 100
                console.log(`更新${currentYear}年价格为: $${fetchedCurrentPrice.toFixed(2)}`)
              } else {
                // 如果今年不在数据中，添加今年的数据
                historicalPrices.push({
                  year: currentYear,
                  price: Math.round(fetchedCurrentPrice * 100) / 100
                })
                console.log(`添加${currentYear}年价格: $${fetchedCurrentPrice.toFixed(2)}`)
              }
            } else {
              console.warn("API返回的价格数据无效")
            }
          } else {
            console.warn(`API响应失败: ${response.status}`)
          }
        } catch (err) {
          console.warn("获取最新价格失败，使用转换后的数据:", err)
        }

        // 确保数据按年份排序
        historicalPrices.sort((a, b) => a.year - b.year)

        // 计算年度变化率
        const priceDataWithChange = historicalPrices.map((item, index) => {
          if (index === 0) {
            return { ...item, change: 0 }
          }
          const prevPrice = historicalPrices[index - 1].price
          const change = ((item.price - prevPrice) / prevPrice) * 100
          return { ...item, change: Math.round(change * 100) / 100 }
        })

        console.log("比特币历史价格数据加载完成:", priceDataWithChange)
        setPriceHistory(priceDataWithChange)

        // 将数据传递给父组件
        onPriceDataChange?.(priceDataWithChange)
      } catch (err) {
        console.error("获取比特币历史价格失败:", err)
        setError("获取价格数据失败，请稍后重试")
      } finally {
        setLoading(false)
      }
    }

    fetchPriceHistory()
  }, [])

  const formatPrice = (price: number) => {
    // 直接显示完整的数字，使用千位分隔符
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Y轴使用更简洁的格式，避免标签过长
  const formatYAxisPrice = (price: number) => {
    return `$ ${price.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isSelectedYear = selectedYear && data.year === selectedYear

      return (
        <div className={`bg-background border rounded-lg p-3 shadow-lg ${isSelectedYear ? 'ring-2 ring-orange-500' : ''}`}>
          <p className="font-medium">{`年份: ${label}${isSelectedYear ? ' (已选择)' : ''}`}</p>
          <p className={`${isSelectedYear ? 'text-orange-600 font-bold' : 'text-orange-600'}`}>
            {`平均价格: ${formatPrice(data.price)}`}
          </p>
          {data.change !== undefined && data.change !== 0 && (
            <p className={`flex items-center gap-1 ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {`年度变化: ${data.change > 0 ? '+' : ''}${data.change}%`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>比特币历史价格</CardTitle>
          <CardDescription>从2009年到现在的年度平均价格走势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">正在加载价格数据...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>比特币历史价格</CardTitle>
          <CardDescription>从2009年到现在的年度平均价格走势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">{error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>比特币历史价格走势</CardTitle>
              <CardDescription className="mt-2">
              {selectedYear && priceHistory.find(item => item.year === selectedYear) && (
                   <div className="!mt-4">🎯 {selectedYear}年比特币价格: <b className="text-orange-600">{formatPrice(priceHistory.find(item => item.year === selectedYear)?.price || 0)}</b></div>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">买入年份：</span>
              <Select
                value={selectedYear?.toString() || (priceHistory.length > 0 ? priceHistory[0].year.toString() : defaultYear.toString())}
                onValueChange={(value: string) => onYearChange?.(parseInt(value))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceHistory.map((item) => (
                    <SelectItem key={item.year} value={item.year.toString()}>
                      {item.year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory} margin={{ top: 20, right: 60, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxisPrice}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* 主要价格线 */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
              />

              {/* 选中年份的垂直参考线 */}
              {selectedYear && priceHistory.find(item => item.year === selectedYear) && (
                <ReferenceLine
                  x={selectedYear}
                  stroke="#ff6b35"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: `${selectedYear}年\n${formatYAxisPrice(priceHistory.find(item => item.year === selectedYear)?.price || 0)}`,
                    position: "top",
                    fill: "#ff6b35",
                    fontSize: 12,
                    fontWeight: "bold",
                    textAnchor: "middle"
                  }}
                />
              )}

              {/* 选中年份的突出数据点 */}
              {selectedYear && priceHistory.find(item => item.year === selectedYear) && (
                <ReferenceDot
                  x={selectedYear}
                  y={priceHistory.find(item => item.year === selectedYear)?.price}
                  r={8}
                  fill="#ff6b35"
                  stroke="#fff"
                  strokeWidth={3}
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(255, 107, 53, 0.6))'
                  }}
                />
              )}

            </LineChart>
          </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  )
}
