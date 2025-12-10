import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosClient";

export const fetchAdminProducts = createAsyncThunk(
  "products/fetchAdminProducts",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/products/admin");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

export const fetchUserProducts = createAsyncThunk(
  "products/fetchUserProducts",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/products");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/products", payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data: payload }, thunkAPI) => {
    try {
      await api.put(`/products/${id}`, payload);
      return { id, ...payload };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    adminList: [],
    userList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.userList = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminList.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.adminList = state.adminList.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        );
      });
  },
});

export default productSlice.reducer;
