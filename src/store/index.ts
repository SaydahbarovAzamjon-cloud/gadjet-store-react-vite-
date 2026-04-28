import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import basketReducer from "./slices/basketSlice";
import productsReducer from "./slices/productsSlice";
import orderReducer from "./slices/orderSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    basket: basketReducer,
    products: productsReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
