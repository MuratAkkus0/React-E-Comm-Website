import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: getProductsFromLS(),
  totalAmount: 0,
  isBasketActive: false,
};

function getProductsFromLS() {
  return JSON.parse(localStorage.getItem("basket")) ?? [];
}

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setProductToBasket: (state, action) => {
      if (action.payload.count == 0) return;
      let product = action.payload;
      let basket = state.products ?? [];
      let findProduct = basket && basket.find((item) => item.id == product.id);

      if (findProduct) {
        let extractedList = basket.filter((item) => item.id != product.id);

        product.count += findProduct.count;
        localStorage.setItem(
          "basket",
          JSON.stringify([...extractedList, product])
        );
        state.products = [...extractedList, product];
      } else {
        localStorage.setItem("basket", JSON.stringify([...basket, product]));
        state.products = [...basket, product];
      }
    },
    setCount: (state, action) => {
      if (action.payload.count < 0) return;
      let basketProducts = JSON.parse(localStorage.getItem("basket"));
      const currentItem = basketProducts[action.payload.index];

      currentItem.count = action.payload.count;
      if (action.payload.count == 0) {
        basketProducts = basketProducts.filter(
          (item) => item.id !== currentItem.id
        );
      }
      localStorage.setItem("basket", JSON.stringify([...basketProducts]));
      state.products = [...basketProducts];
    },
    setIsBasketActive: (state, action) => {
      state.isBasketActive = action.payload ?? !state.isBasketActive;
    },
    setTotalAmount: (state) => {
      state.totalAmount = 0;
      state.products &&
        state.products.map((item) => {
          state.totalAmount += item.price * item.count;
        });
      state.totalAmount = state.totalAmount.toFixed(2);
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
