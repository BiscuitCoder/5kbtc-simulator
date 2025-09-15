"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Bitcoin } from "lucide-react"
import SatoshiAssets from "@/components/satoshi-assets"
import HeaderSection from "@/components/sections/header-section"
import ShoppingCartSection from "@/components/sections/shopping-cart-section"
import CartSummary from "@/components/sections/cart-summary"
import FooterSection from "@/components/sections/footer-section"
import PurchaseDialog from "@/components/sections/purchase-dialog"
import BitcoinPriceHistory from "@/components/sections/btc-price-history"
import { useCartStore } from "@/lib/store"

interface BTCPrice {
  usd: number
  usd_24h_change: number
}

interface ComparisonItem {
  name: string
  price: number
  image: string
  unit: string
  dynasty?: string
  years?: number
}

// 飘落的比特币动画组件
function FloatingBitcoin() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl money-rain bg-yellow-500 rounded-full border-2 border-white p-2 shadow-muted"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <Bitcoin className="text-white"/>
        </div>
      ))}
    </div>
  )
}

export default function KBTCSimulator() {
  const [btcPrice, setBtcPrice] = useState<BTCPrice>({ usd: 100000, usd_24h_change: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [defaultYear, setDefaultYear] = useState<number>(2014)
  const [priceHistoryData, setPriceHistoryData] = useState<any[]>([])

  // 从 localStorage 读取保存的年份
  useEffect(() => {
    const savedYear = localStorage.getItem('satoshi-simulator-selected-year')
    if (savedYear) {
      const year = parseInt(savedYear)
      if (!isNaN(year)) {
        setSelectedYear(year)
      }
    }
  }, [])

  // 当价格数据加载时，设置默认年份
  const handlePriceDataChange = (data: any[]) => {
    setPriceHistoryData(data)
    if (data.length > 0 && !selectedYear) {
      // 如果没有保存的年份，则使用第一个年份作为默认
      const firstYear = data[0].year
      setDefaultYear(firstYear)
      if (!localStorage.getItem('satoshi-simulator-selected-year')) {
        setSelectedYear(firstYear)
      }
    }
  }

  // 年份选择处理函数，包含本地存储
  const handleYearChange = (year: number | null) => {
    setSelectedYear(year)
    if (year) {
      localStorage.setItem('satoshi-simulator-selected-year', year.toString())
    } else {
      localStorage.removeItem('satoshi-simulator-selected-year')
    }
  }

  // 使用zustand store
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getRemainingAssets,
    getItemQuantity,
    getItemSubtotal
  } = useCartStore()

  // 5KBTC 概念：6千人民币在不同年份购买BTC
  const cnyAmount = 6000 // 6千人民币
  const exchangeRate = 6.5 // 人民币兑美元汇率

  // 将人民币价格转换为美元价格
  const convertToUSD = (cnyPrice: number) => Math.round((cnyPrice / exchangeRate) * 100) / 100

  // 获取对应年份的BTC价格（使用图表组件的数据）
  const getBTCPriceByYear = (year: number): number => {
    const priceData = priceHistoryData.find(item => item.year === year)
    return priceData ? priceData.price : btcPrice.usd
  }

  // 计算在指定年份用6千人民币能买多少BTC
  const userBTC = priceHistoryData.length > 0 ? (cnyAmount / exchangeRate) / getBTCPriceByYear(selectedYear || priceHistoryData[0]?.year || 2014) : 0
  const currentValue = userBTC * btcPrice.usd

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
        )
        const data = await response.json()

        // 验证API返回的数据
        const usdPrice = data?.bitcoin?.usd
        const change24h = data?.bitcoin?.usd_24h_change

        if (usdPrice && usdPrice > 0) {
          setBtcPrice({
            usd: usdPrice,
            usd_24h_change: change24h || 0,
          })
        } else {
          console.log("API返回无效价格，使用默认价格")
          // 保持默认价格不变
        }
      } catch (error) {
        console.log("API调用失败，使用默认价格:", error)
        // 保持默认价格不变
      } finally {
        setLoading(false)
      }
    }

    fetchBTCPrice()
    const interval = setInterval(fetchBTCPrice, 30000) // 每30秒更新一次

    return () => clearInterval(interval)
  }, [])

  // 保持向后兼容性，totalValue 现在表示用户当前资产价值
  const totalValue = currentValue

  const comparisonItems: ComparisonItem[] = [
    {
      name: "西贝老罗套餐（热门推荐）",
      price: convertToUSD(785),
      image: "/goods/14.png",
      unit: "顿"
    },
    {
      name: "亲嘴烧零食大礼包",
      price: convertToUSD(13.9),
      image: "/goods/1.png",
      unit: "包",
    },
    {
      name: "iPhone 17 Pro",
      price: convertToUSD(8999),
      image: "/goods/3.png",
      unit: "台"
    },
    {
      name: "隆江猪脚饭",
      price: convertToUSD(23),
      image: "/goods/2.png",
      unit: "袋"
    },
    {
      name: "任天堂Switch",
      price: convertToUSD(2438),
      image: "/goods/5.png",
      unit: "台",
    },
    {
      name: "北京二锅头",
      price: convertToUSD(32.90),
      image: "/goods/7.png",
      unit: "瓶"
    },
    {
      name: "PS5 游戏机",
      price: convertToUSD(2038),
      image: "/goods/8.png",
      unit: "台",
    },
    {
      name: "MacBookPro16英寸M4Pro",
      price: convertToUSD(19999),
      image: "/goods/9.png",
      unit: "台",
    },
    {
      name: "大疆Mini 3",
      price: convertToUSD(2188),
      image: "/goods/4.png",
      unit: "架"
    }, {
      name: "三年高考两年模拟",
      price: convertToUSD(108),
      image: "/goods/10.png",
      unit: "本"
    },
    {
      name: "特斯拉Model X",
      price: convertToUSD(720000),
      image: "/goods/11.png",
      unit: "辆",
    },
    {
      name: "一斤猪肉",
      price: convertToUSD(16),
      image: "/goods/12.png",
      unit: "斤"
    },
    {
      name: "大瓶装冰红茶",
      price: convertToUSD(4.5),
      image: "/goods/13.png",
      unit: "件"
    },
    {
      name: "网易云会员",
      price: convertToUSD(15),
      image: "/goods/15.png",
      unit: "月"
    },
    {
      name: "宏光MINIEV",
      price: convertToUSD(30000),
      image: "/goods/16.png",
      unit: "辆"
    },
    {
      name: "Claude 订阅",
      price: convertToUSD(130),
      image: "/goods/17.png",
      unit: "月"
    }
  ]

  // 使用store中的计算方法
  const cartTotal = getCartTotal(comparisonItems)
  const remainingAssets = getRemainingAssets(totalValue, comparisonItems)


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      
      <FloatingBitcoin />
      

      <div className="container mx-auto px-4 py-8 relative z-10">

        <HeaderSection
          satoshiAddress="5KBTC"
        />


       <BitcoinPriceHistory
         className="mb-8"
         selectedYear={selectedYear}
         onYearChange={handleYearChange}
         onPriceDataChange={handlePriceDataChange}
         defaultYear={defaultYear}
       />

        <SatoshiAssets
          satoshiBTC={userBTC}
          satoshiAddress="5KBTC"
          cnyAmount={cnyAmount}
          currentValue={currentValue}
        />


        <ShoppingCartSection comparisonItems={comparisonItems} remainingAssets={remainingAssets} />

        <CartSummary
          totalValue={totalValue}
          cartTotal={cartTotal}
          remainingAssets={remainingAssets}
          onPurchaseClick={() => setShowPurchaseDialog(true)}
        />

        <FooterSection />
      </div>

      <PurchaseDialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog} />
    </div>
  )
}
