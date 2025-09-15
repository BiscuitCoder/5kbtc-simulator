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
  const [selectedYear, setSelectedYear] = useState<number>(2021) // 默认选择2021年

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

  // 5KBTC 概念：5千人民币在不同年份购买BTC
  const cnyAmount = 5000 // 5千人民币
  const exchangeRate = 6.5 // 人民币兑美元汇率

  // 获取对应年份的BTC价格
  const getBTCPriceByYear = (year: number): number => {
    const historicalPrices: { [key: number]: number } = {
      2009: 0.001,
      2010: 0.06,
      2011: 4.89,
      2012: 8.26,
      2013: 259.99,
      2014: 526.23,
      2015: 272.02,
      2016: 568.49,
      2017: 3266.45,
      2018: 7427.82,
      2019: 7320.57,
      2020: 11015.66,
      2021: 47886.69,
      2022: 19421.05,
      2023: 29890.23,
      2024: 63204.98,
      2025: 95000.00,
    }
    return historicalPrices[year] || btcPrice.usd
  }

  // 计算在指定年份用5千人民币能买多少BTC
  const userBTC = (cnyAmount / exchangeRate) / getBTCPriceByYear(selectedYear)
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
    // 低价商品 (几美元到几百美元)
    {
      name: "星巴克咖啡",
      price: 5,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop&crop=center",
      unit: "杯",
      years: 5,
    },
    {
      name: "iPhone充电线",
      price: 25,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      unit: "根",
      years: 2,
    },
    {
      name: "耐克运动鞋",
      price: 120,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&crop=center",
      unit: "双",
      years: 3,
    },
    {
      name: "Switch游戏机",
      price: 299,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop&crop=center",
      unit: "台",
      years: 8,
    },

    // 中价商品 (几百到几千美元)
    {
      name: "iPhone 15 Pro Max",
      price: 1199,
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop&crop=center",
      unit: "台",
      years: 3,
    },
    {
      name: "PS5游戏机",
      price: 499,
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&h=200&fit=crop&crop=center",
      unit: "台",
      years: 8,
    },
    {
      name: "MacBook Pro",
      price: 2499,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center",
      unit: "台",
      years: 5,
    },
    {
      name: "DJI无人机",
      price: 1299,
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop&crop=center",
      unit: "架",
      years: 3,
    },

    // 高价商品 (几万到几十万美元)
    {
      name: "特斯拉Model 3",
      price: 35000,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=200&fit=crop&crop=center",
      unit: "辆",
      years: 10,
    },
    {
      name: "特斯拉Model S",
      price: 89990,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=200&fit=crop&crop=center",
      unit: "辆",
      years: 8,
    },
    {
      name: "私人飞机",
      price: 2000000, // 200万美元
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop&crop=center",
      unit: "架",
      years: 30,
    },
    {
      name: "豪华游艇",
      price: 5000000, // 500万美元
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop&crop=center",
      unit: "艘",
      years: 50,
    },

    // 新增商品 - 从lemonjing.com/rich提取的商品
    {
      name: "路易威登手袋",
      price: 5000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop&crop=center",
      unit: "个",
      years: 15,
    },
    {
      name: "劳力士手表",
      price: 15000,
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop&crop=center",
      unit: "块",
      years: 20,
    },
    {
      name: "法拉利跑车",
      price: 300000,
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200&fit=crop&crop=center",
      unit: "辆",
      years: 25,
    },
    {
      name: "私人岛屿",
      price: 10000000,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center",
      unit: "个",
      years: 50,
    },
    {
      name: "古驰包包",
      price: 2500,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop&crop=center",
      unit: "个",
      years: 12,
    },
    {
      name: "香奈儿香水",
      price: 300,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=200&fit=crop&crop=center",
      unit: "瓶",
      years: 5,
    },
    {
      name: "普拉达鞋子",
      price: 800,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center",
      unit: "双",
      years: 8,
    },
    {
      name: "范思哲太阳镜",
      price: 400,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop&crop=center",
      unit: "副",
      years: 6,
    },

    // 超高价商品 (几百万到几十亿美元)
    {
      name: "比佛利山庄豪宅",
      price: 15000000, // 1500万美元
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop&crop=center",
      unit: "栋",
      years: 100,
    },
    {
      name: "北京四合院",
      price: 50000000, // 5000万美元
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop&crop=center",
      unit: "套",
      years: 200,
    },
    {
      name: "SpaceX Starship",
      price: 200000000, // 2亿美元
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop&crop=center",
      unit: "枚",
      years: 50,
    },
    {
      name: "波音747客机",
      price: 300000000, // 3亿美元
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop&crop=center",
      unit: "架",
      years: 40,
    },
    {
      name: "大型强子对撞机",
      price: 10000000000, // 100亿美元
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop&crop=center",
      unit: "座",
      years: 30,
    },
    {
      name: "航母（福特级）",
      price: 13000000000, // 130亿美元
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      unit: "艘",
      years: 50,
    },
    {
      name: "国际空间站",
      price: 150000000000, // 1500亿美元
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&h=200&fit=crop&crop=center",
      unit: "座",
      years: 30,
    },
  ]

  // 使用store中的计算方法
  const cartTotal = getCartTotal(comparisonItems)
  const remainingAssets = getRemainingAssets(totalValue, comparisonItems)


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      
      <FloatingBitcoin />
      

      <div className="container mx-auto px-4 py-8 relative z-10">

        <HeaderSection
          satoshiAddress={`5KBTC-${selectedYear}`}
        />


       <BitcoinPriceHistory className="mb-8" selectedYear={selectedYear} onYearChange={setSelectedYear} />

        <SatoshiAssets
          satoshiBTC={userBTC}
          satoshiAddress={`5KBTC-${selectedYear}`}
          cnyAmount={cnyAmount}
          selectedYear={selectedYear}
          purchasePrice={getBTCPriceByYear(selectedYear)}
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
