import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

interface BasketState {
  cartItems: CartItem[];
}

const initialState: BasketState = {
  cartItems: [],
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // Productni qo'shish — allaqachon bor bo'lsa quantity++
    onAdd(state, action: PayloadAction<CartItem>) {
      const exist = state.cartItems.find((x) => x._id === action.payload._id);
      if (exist) {
        exist.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    // Quantityni 1 kamaytirish — 1 bo'lsa o'chirish
    onRemove(state, action: PayloadAction<CartItem>) {
      const exist = state.cartItems.find((x) => x._id === action.payload._id);
      if (!exist) return;
      if (exist.quantity === 1) {
        state.cartItems = state.cartItems.filter((x) => x._id !== action.payload._id);
      } else {
        exist.quantity -= 1;
      }
    },
    // Bitta itemni to'liq o'chirish
    onDelete(state, action: PayloadAction<CartItem>) {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload._id);
    },
    // Hammani tozalash
    onDeleteAll(state) {
      state.cartItems = [];
    },
  },
});

export const { onAdd, onRemove, onDelete, onDeleteAll } = basketSlice.actions;
export default basketSlice.reducer;
