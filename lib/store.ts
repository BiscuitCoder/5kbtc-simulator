import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  cart: { [key: number]: number }
  addToCart: (itemIndex: number, quantity?: number) => void
  removeFromCart: (itemIndex: number, quantity?: number) => void
  clearCart: () => void
  getCartTotal: (comparisonItems: any[]) => number
  getRemainingAssets: (totalValue: number, comparisonItems: any[]) => number
  getItemQuantity: (itemIndex: number) => number
  getItemSubtotal: (itemIndex: number, comparisonItems: any[]) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},

      addToCart: (itemIndex: number, quantity: number = 1) =>
        set((state) => ({
          cart: {
            ...state.cart,
            [itemIndex]: (state.cart[itemIndex] || 0) + quantity
          }
        })),

      removeFromCart: (itemIndex: number, quantity: number = 1) =>
        set((state) => {
          const newCart = { ...state.cart }
          if (newCart[itemIndex] > quantity) {
            newCart[itemIndex] -= quantity
          } else {
            delete newCart[itemIndex]
          }
          return { cart: newCart }
        }),

      clearCart: () => set({ cart: {} }),

      getCartTotal: (comparisonItems: any[]) => {
        const { cart } = get()
        return Object.entries(cart).reduce((total, [itemIndex, quantity]) => {
          const item = comparisonItems[parseInt(itemIndex)]
          return total + (item.price * quantity)
        }, 0)
      },

      getRemainingAssets: (totalValue: number, comparisonItems: any[]) => {
        // 直接计算购物车总价，避免递归调用
        const { cart } = get()
        const cartTotal = Object.entries(cart).reduce((total, [itemIndex, quantity]) => {
          const item = comparisonItems[parseInt(itemIndex)]
          return total + (item.price * quantity)
        }, 0)
        return totalValue - cartTotal
      },

      getItemQuantity: (itemIndex: number) => {
        const { cart } = get()
        return cart[itemIndex] || 0
      },

      getItemSubtotal: (itemIndex: number, comparisonItems: any[]) => {
        const { cart } = get()
        const item = comparisonItems[itemIndex]
        return (cart[itemIndex] || 0) * item.price
      }
    }),
    {
      name: 'satoshi-cart-storage',
    }
  )
)
