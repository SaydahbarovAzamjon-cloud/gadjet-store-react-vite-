import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/lib/apiService";

// ─── Mavjud: status bo'yicha orders yuklash ───────────────────────────────────
export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (params: any, { rejectWithValue }) => {
    try {
      const { page, limit, orderStatus } = params;
      const { data } = await apiService.get(
        `/order/all?page=${page}&limit=${limit}&orderStatus=${orderStatus}`
      );
      return data.data ?? data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

// ─── YANGI: barcha statuslardagi orderlardan statistika hisoblash ─────────────
// PAUSE + PROCESS + FINISH statuslaridan parallel yuklaydi,
// jami orders soni va sarflangan pulni qaytaradi.
// CheckoutPage va OrdersPage da dispatch(fetchOrderStats()) bilan yangilanadi.
export const fetchOrderStats = createAsyncThunk(
  "orders/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // 3 ta status parallel ravishda yuklanadi (tezlik uchun)
      const [pausedRes, processRes, finishRes] = await Promise.all([
        apiService.get("/order/all?page=1&limit=1000&orderStatus=PAUSE"),
        apiService.get("/order/all?page=1&limit=1000&orderStatus=PROCESS"),
        apiService.get("/order/all?page=1&limit=1000&orderStatus=FINISH"),
      ]);

      // Har bir response ni normallashtirish
      const paused:  any[] = pausedRes.data.data  ?? pausedRes.data  ?? [];
      const process: any[] = processRes.data.data ?? processRes.data ?? [];
      const finish:  any[] = finishRes.data.data  ?? finishRes.data  ?? [];

      const allOrders = [...paused, ...process, ...finish];

      // Jami orderlar soni (barcha statuslar)
      const totalOrders = allOrders.length;

      // Jami sarflangan pul (barcha orderTotal lar yig'indisi)
      const totalSpent = allOrders.reduce(
        (sum: number, order: any) => sum + (order.orderTotal || 0),
        0
      );

      return { totalOrders, totalSpent };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load stats"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [] as any[],
    loading: false,
    error: null as string | null,

    // ─── Yangi: order statistikasi ───────────────────────────────────────────
    stats: {
      totalOrders: 0,     // shu paytgacha nechta order qilingan
      totalSpent: 0,      // shu paytgacha qancha pul sarflangan ($)
      statsLoading: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    // ── fetchOrders (mavjud) ─────────────────────────────────────────────────
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── fetchOrderStats (yangi) ───────────────────────────────────────────────
    builder
      .addCase(fetchOrderStats.pending, (state) => {
        state.stats.statsLoading = true;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats.statsLoading  = false;
        state.stats.totalOrders   = action.payload.totalOrders;
        state.stats.totalSpent    = action.payload.totalSpent;
      })
      .addCase(fetchOrderStats.rejected, (state) => {
        state.stats.statsLoading = false;
      });
  },
});

export default ordersSlice.reducer;