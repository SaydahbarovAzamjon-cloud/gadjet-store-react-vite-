import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../lib/apiService";

export interface AuthMember {
  _id: string;
  memberNick: string;
  memberPhone: string;
  memberType: string;
  memberStatus: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberPoints?: number;
}

interface AuthState {
  member: AuthMember | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  member: null,
  loading: false,
  error: null,
};

// POST /member/signup
export const signupMember = createAsyncThunk(
  "auth/signup",
  async (input: { memberNick: string; memberPhone: string; memberPassword: string }, { rejectWithValue }) => {
    try {
      const { data } = await apiService.post("/member/signup", input);
      // accessToken cookie is set by backend automatically
      return data.member as AuthMember;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// POST /member/login
export const loginMember = createAsyncThunk(
  "auth/login",
  async (input: { memberNick: string; memberPassword: string }, { rejectWithValue }) => {
    try {
      const { data } = await apiService.post("/member/login", input);
      // accessToken cookie is set by backend automatically
      return data.member as AuthMember;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// GET /member/detail — token bilan foydalanuvchini tekshirish
export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiService.get("/member/detail");
      return data as AuthMember;
    } catch (err: any) {
      return rejectWithValue("Not authenticated");
    }
  }
);

// POST /member/logout — backend cookie ni tozalaydi
export const logoutMemberAsync = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await apiService.post("/member/logout");
    } catch (_) {
      // logout muvaffaqiyatsiz bo'lsa ham, local state ni tozalaymiz
    }
    // cookie is cleared by backend /member/logout endpoint
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutMember(state) {
      state.member = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    updateMemberLocal(state, action) {
      if (state.member) {
        state.member = { ...state.member, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupMember.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupMember.fulfilled, (state, action) => { state.loading = false; state.member = action.payload; })
      .addCase(signupMember.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    builder
      .addCase(loginMember.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginMember.fulfilled, (state, action) => { state.loading = false; state.member = action.payload; })
      .addCase(loginMember.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    builder
      .addCase(verifyAuth.fulfilled, (state, action) => { state.member = action.payload; })
      .addCase(verifyAuth.rejected, (state) => { state.member = null; });
    builder
      .addCase(logoutMemberAsync.fulfilled, (state) => { state.member = null; state.error = null; });
  },
});

export const { logoutMember, clearError, updateMemberLocal } = authSlice.actions;
export default authSlice.reducer;
