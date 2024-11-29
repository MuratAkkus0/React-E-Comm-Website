import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

const initialState = {
  products: [],
  selectedProduct: [],
  isProductLoading: false,
};

export const getAllProducts = createAsyncThunk("getAllProducts", async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
});

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.isProductLoading = true;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isProductLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      if (action.error)
        throw new Error(
          `Deneme Error ${action.error.stack}: ${action.error.message}`,
          {
            cause:
              "Check your API key or be sure that your API server is running.",
          }
        );
    });
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
