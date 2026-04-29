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

// ─── FIX 2: Faqat PROCESS + FINISH orderlardan statistika hisoblash ───────────
// PAUSE = faqat basket/checkout bosqichi (hali to'lanmagan).
// Statistikaga faqat to'langan (PROCESS) va yetkazilgan (FINISH) orderlar kiradi.
// Shuning uchun PAUSE parallel fetchdan olib tashlandi.
export const fetchOrderStats = createAsyncThunk(
  "orders/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // Faqat 2 ta status: PROCESS (to'langan) + FINISH (yetkazilgan)
      // PAUSE (basket qo'shilgan, to'lanmagan) hisobga olinmaydi
      const [processRes, finishRes] = await Promise.all([
        apiService.get("/order/all?page=1&limit=1000&orderStatus=PROCESS"),
        apiService.get("/order/all?page=1&limit=1000&orderStatus=FINISH"),
      ]);

      // Har bir response ni normallashtirish
      const process: any[] = processRes.data.data ?? processRes.data ?? [];
      const finish:  any[] = finishRes.data.data  ?? finishRes.data  ?? [];

      // Faqat to'langan orderlar
      const paidOrders = [...process, ...finish];

      // Jami to'langan orderlar soni
      const totalOrders = paidOrders.length;

      // Jami sarflangan pul (barcha orderTotal lar yig'indisi)
      const totalSpent = paidOrders.reduce(
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

    // ─── Order statistikasi (faqat to'langan: PROCESS + FINISH) ─────────────
    stats: {
      totalOrders: 0,     // to'langan orderlar soni
      totalSpent: 0,      // jami sarflangan pul ($)
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

    // ── fetchOrderStats ───────────────────────────────────────────────────────
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