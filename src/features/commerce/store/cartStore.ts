import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,
      add: (item) =>
        set((state) => ({
          items: [...state.items, item],
          total: state.total + item.price,
          itemCount: state.itemCount + 1,
        })),
      remove: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id)
          return {
            items: state.items.filter((i) => i.id !== id),
            total: state.total - (item?.price ?? 0),
            itemCount: Math.max(0, state.itemCount - 1),
          }
        }),
      clear: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    { name: 'codetrack-cart' }
  )
)
