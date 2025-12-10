import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient";

export const fetchAdminPromotions = createAsyncThunk(
  "promotions/fetchAdminPromotions",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/promotions/admin");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load promotions"
      );
    }
  }
);

export const fetchActivePromotions = createAsyncThunk(
  "promotions/fetchActivePromotions",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/promotions/active");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load promotions"
      );
    }
  }
);

export const createPromotion = createAsyncThunk(
  "promotions/createPromotion",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/promotions", payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create promotion"
      );
    }
  }
);

const promotionSlice = createSlice({
  name: "promotions",
  initialState: {
    adminList: [],
    activeList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload;
      })
      .addCase(fetchAdminPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.activeList = action.payload;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.adminList.push(action.payload);
      });
  },
});

export default promotionSlice.reducer;
