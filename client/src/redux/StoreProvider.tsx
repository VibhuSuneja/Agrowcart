'use client'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

import { hydrateCart } from './cartSlice'

function StoreProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Hydrate cart on client side only to match server SSR
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("agrowcart_cart")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (Array.isArray(data) && data.length > 0) {
            store.dispatch(hydrateCart(data))
          }
        } catch (e) {
          console.error("Failed to hydrate cart", e)
        }
      }
    }
  }, [])

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default StoreProvider
