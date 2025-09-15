import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import CountUp from "react-countup"
import { useCartStore } from "@/lib/store"

interface ComparisonItem {
  name: string
  price: number
  image: string
  unit: string
  dynasty?: string
  years?: number
}

interface ShoppingCartSectionProps {
  comparisonItems: ComparisonItem[]
  remainingAssets: number
}

export default function ShoppingCartSection({ comparisonItems, remainingAssets }: ShoppingCartSectionProps) {
  const {
    cart,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getItemSubtotal
  } = useCartStore()

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-yellow-600">🛒 或者，你可以尝试购买点什么？</h2>
      <p className="text-center text-muted-foreground mb-8">
        选择商品数量，实时计算价格！
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {useMemo(() => {
          return comparisonItems.map((item, index) => {
            // 基于剩余资产计算可购买数量，并减去已在购物车中的数量
            const maxPurchasable = remainingAssets > 0 ? Math.floor(remainingAssets / item.price) : 0
            const alreadyInCart = getItemQuantity(index)
            const quantity = Math.max(0, maxPurchasable - alreadyInCart)

            return (
              <Card
                key={index}
                className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-card to-muted/30 border-primary/10"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-6">
                    {/* 放大的商品图片 */}
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/128x128?text=No+Image'
                        }}
                      />
                    </div>

                    {/* 商品信息区域 */}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-2">
                        <div className="font-bold text-foreground">{item.name}</div>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        单价: ${item.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        可购买: {quantity} {item.unit}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* 购物车数量选择器 */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-green-800 flex items-center space-x-2">
                        <span>🛒 </span>
                        {getItemQuantity(index) > 0 ? (
                          <div className="text-center">
                            <div className="text-sm text-green-700 font-medium">
                              小计: ${getItemSubtotal(index, comparisonItems).toLocaleString()}
                            </div>
                          </div>
                        ) : <span>$0.00</span>}
                      </div>
                      <div className="text-sm text-green-600 font-bold">
                        当前: {getItemQuantity(index)} {item.unit}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        onClick={() => removeFromCart(index)}
                        disabled={getItemQuantity(index) <= 0}
                        size="sm"
                        variant="outline"
                        className="cursor-pointer h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-600"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => addToCart(index, 1)}
                          size="sm"
                          variant="outline"
                          className="cursor-pointer h-8 px-3 border-green-300 text-green-600 hover:bg-green-50 hover:text-green-600"
                        >
                          +1
                        </Button>
                        <Button
                          onClick={() => addToCart(index, 10)}
                          size="sm"
                          variant="outline"
                          className="cursor-pointer h-8 px-3 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                        >
                          +10
                        </Button>
                        <Button
                          onClick={() => addToCart(index, 100)}
                          size="sm"
                          variant="outline"
                          className="cursor-pointer h-8 px-3 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-600"
                        >
                          +100
                        </Button>
                      </div>
                      <Button
                        onClick={() => addToCart(index)}
                        disabled={getItemQuantity(index) <= 0}
                        size="sm"
                        variant="outline"
                        className="cursor-pointer h-8 w-8 p-0 border-green-300 text-green-600 hover:bg-green-50 hover:text-green-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        }, [comparisonItems, remainingAssets, cart, getItemQuantity, getItemSubtotal])}
      </div>
    </div>
  )
}
