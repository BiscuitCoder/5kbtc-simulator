import { Button } from "@/components/ui/button"
import CountUp from "react-countup"
import { useCartStore } from "@/lib/store"

interface CartSummaryProps {
  totalValue: number
  cartTotal: number
  remainingAssets: number
  onPurchaseClick: () => void
}

export default function CartSummary({
  totalValue,
  cartTotal,
  remainingAssets,
  onPurchaseClick
}: CartSummaryProps) {
  const { cart, clearCart } = useCartStore()

  return (
    <>
      {/* 常驻购物车摘要 - 固定在底部 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-primary/20 shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-xl font-bold text-primary mb-1">
                <CountUp end={totalValue} duration={2} separator="," prefix="$" />
              </div>
              <div className="text-xs text-muted-foreground">总资产价值</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent mb-1">
                <CountUp end={cartTotal} duration={2} separator="," prefix="$" />
              </div>
              <div className="text-xs text-muted-foreground">购物车总计</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold mb-1 ${remainingAssets >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <CountUp end={remainingAssets} duration={2} separator="," prefix="$" />
              </div>
              <div className="text-xs text-muted-foreground">剩余资产</div>
              {remainingAssets < 0 && (
                <div className="text-xs text-red-500 mt-1">⚠️ 这都能破产，你到底想要干啥？</div>
              )}
            </div>
          </div>

          <div className="py-4">
            {Object.keys(cart).length > 0 && (
              <div className="flex justify-center space-x-10">
                <Button
                  onClick={clearCart}
                  size={'lg'}
                  variant="outline"
                  className="cursor-pointer text-red-600 border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  清空购物车
                </Button>
                <Button
                  size={'lg'}
                  className="bg-green-500 text-white hover:bg-green-600 hover:text-white cursor-pointer"
                  onClick={onPurchaseClick}
                >
                  立即购买
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 为固定底部购物车预留空间 */}
      <div className="h-32"></div>
    </>
  )
}
