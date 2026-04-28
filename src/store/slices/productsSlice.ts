import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../lib/apiService";

export interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  productCategory: string;
  productStatus: string;
  productImages: string[];
  productViews: number;
  productLeftCount: number;
  productDesc: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// Backend route: GET /product/all
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (
    {
      page = 1,
      limit = 20,
      order = "createdAt",
      productCategory,
      search,
    }: {
      page?: number;
      limit?: number;
      order?: string;
      productCategory?: string;
      search?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      let url = `/product/all?page=${page}&limit=${limit}&order=${order}`;
      if (productCategory) url += `&productCategory=${productCategory}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const { data } = await apiService.get(url);
      return data as Product[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load products");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Modal ochilganda backend dan kelgan yangi views ni store ga yozish
    updateProductViews(state, action: { payload: { id: string; views: number } }) {
      const product = state.products.find((p) => p._id === action.payload.id);
      if (product) {
        product.productViews = action.payload.views; // store ni yangilaymiz — card ham o'zgaradi
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateProductViews } = productsSlice.actions; // export qilamiz
export default productsSlice.reducer;
