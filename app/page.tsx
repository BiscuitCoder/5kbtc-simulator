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

export default function SatoshiSimulator() {
  const [btcPrice, setBtcPrice] = useState<BTCPrice>({ usd: 100000, usd_24h_change: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)

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

  // 中本聪估计持有的BTC数量（约100万枚）
  const satoshiBTC = 1100000
  const satoshiAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"

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

  const totalValue = satoshiBTC * btcPrice.usd

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
        <HeaderSection satoshiAddress={satoshiAddress} />

        <SatoshiAssets satoshiBTC={satoshiBTC} satoshiAddress={satoshiAddress} />

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
