import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

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
      if (action.payload.count == 0) {
        toast.info("Please select product quantity first.");
        return;
      }
      try {
        let product = action.payload;
        let basket = state.products ?? [];
        let findProduct =
          basket && basket.find((item) => item.id == product.id);

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
        toast.success("Product successfuly added to basket.");
      } catch (error) {
        throw new Error("Error by setProductToBasket");
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
        toast.success("Product successfuly deleted from basket.");
      }
      localStorage.setItem("basket", JSON.stringify([...basketProducts]));
      state.products = [...basketProducts];
    },
    setIsBasketActive: (state, action) => {
      state.isBasketActive = action.payload ?? !state.isBasketActive;
    },
    setTotalAmount: (state) => {
      try {
        state.totalAmount = 0;
        state.products &&
          state.products.map((item) => {
            state.totalAmount += item.price * item.count;
          });
        state.totalAmount = state.totalAmount.toFixed(2);
      } catch (error) {
        throw new Error("Error by setTotalAmount");
      }
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
