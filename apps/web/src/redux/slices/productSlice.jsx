import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

const initialState = {
  products: [],
  selectedProduct: null,
  isProductLoading: false,
};

export const getAllProducts = createAsyncThunk("getAllProducts", async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
});

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.isProductLoading = true;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isProductLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      if (action.error) {
        throw new Error(
          `Failed to load products from fakestoreapi.com: ${action.error.message}`
        );
      }
    });
  },
});

export const { setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
