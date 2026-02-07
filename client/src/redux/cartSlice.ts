import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IProduct {
   _id: string,
   name: string,
   category: string,
   price: string,
   unit: string,
   quantity: number,
   image: string,
   createdAt?: Date,
   updatedAt?: Date
}
interface ICartSlice {
   cartData: IProduct[],
   subTotal: number,
   deliveryFee: number,
   finalTotal: number
}

const isClient = typeof window !== "undefined"

const loadCartData = (): IProduct[] => {
   if (!isClient) return []
   const saved = localStorage.getItem("agrowcart_cart")
   return saved ? JSON.parse(saved) : []
}

const saveCartData = (data: IProduct[]) => {
   if (isClient) {
      localStorage.setItem("agrowcart_cart", JSON.stringify(data))
   }
}

const initialCartData = loadCartData()
const initialSubTotal = initialCartData.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0)
const initialDeliveryFee = initialSubTotal === 0 ? 0 : (initialSubTotal > 1000 ? 0 : 40)
const initialFinalTotal = initialSubTotal + initialDeliveryFee

const initialState: ICartSlice = {
   cartData: initialCartData,
   subTotal: initialSubTotal,
   deliveryFee: initialDeliveryFee,
   finalTotal: initialFinalTotal
}

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action: PayloadAction<IProduct>) => {
         const existing = state.cartData.find(item => item._id === action.payload._id)
         if (existing) {
            existing.quantity += action.payload.quantity || 1
         } else {
            state.cartData.push({ ...action.payload, quantity: action.payload.quantity || 1 })
         }
         cartSlice.caseReducers.calculateTotals(state)
         saveCartData(state.cartData)
      },
      increaseQuantity: (state, action: PayloadAction<string>) => {
         const item = state.cartData.find(i => i._id == action.payload)
         if (item) {
            item.quantity = item.quantity + 1
         }
         cartSlice.caseReducers.calculateTotals(state)
         saveCartData(state.cartData)
      },
      decreaseQuantity: (state, action: PayloadAction<string>) => {
         const item = state.cartData.find(i => i._id == action.payload)
         if (item?.quantity && item.quantity > 1) {
            item.quantity = item.quantity - 1
         } else {
            state.cartData = state.cartData.filter(i => i._id !== action.payload)
         }
         cartSlice.caseReducers.calculateTotals(state)
         saveCartData(state.cartData)
      },
      removeFromCart: (state, action: PayloadAction<string>) => {
         state.cartData = state.cartData.filter(i => i._id !== action.payload)
         cartSlice.caseReducers.calculateTotals(state)
         saveCartData(state.cartData)
      },
      calculateTotals: (state) => {
         state.subTotal = state.cartData.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0)
         state.deliveryFee = state.subTotal === 0 ? 0 : (state.subTotal > 1000 ? 0 : 40)
         state.finalTotal = state.subTotal + state.deliveryFee
      }
   }
})

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions
export default cartSlice.reducer
