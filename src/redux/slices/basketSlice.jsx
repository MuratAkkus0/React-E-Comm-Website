import { createSlice } from "@reduxjs/toolkit";

function getProductsFromLS() {
  try {
    return JSON.parse(localStorage.getItem("basket")) ?? [];
  } catch {
    return [];
  }
}

const initialState = {
  products: getProductsFromLS(),
  totalAmount: 0,
  isBasketActive: false,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setProductToBasket: (state, action) => {
      const product = action.payload;
      const basket = state.products ?? [];
      const existingProduct = basket.find((item) => item.id === product.id);

      if (existingProduct) {
        state.products = basket.map((item) =>
          item.id === product.id
            ? { ...item, count: item.count + product.count }
            : item
        );
      } else {
        state.products = [...basket, product];
      }
    },
    setCount: (state, action) => {
      const { index, count } = action.payload;
      if (count < 0) return;

      const currentItem = state.products?.[index];
      if (!currentItem) return;

      if (count === 0) {
        state.products = state.products.filter(
          (item) => item.id !== currentItem.id
        );
      } else {
        state.products = state.products.map((item, i) =>
          i === index ? { ...item, count } : item
        );
      }
    },
    setIsBasketActive: (state, action) => {
      state.isBasketActive = action.payload ?? !state.isBasketActive;
    },
    setTotalAmount: (state) => {
      const total = (state.products ?? []).reduce(
        (sum, item) => sum + item.price * item.count,
        0
      );
      state.totalAmount = total.toFixed(2);
    },
  },
});

export const {
  setProductToBasket,
  setCount,
  setIsBasketActive,
  setTotalAmount,
} = basketSlice.actions;
export default basketSlice.reducer;
