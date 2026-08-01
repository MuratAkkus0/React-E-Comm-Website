import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setProductToBasket, setCount } from "./slices/basketSlice";

export const listenerMiddleware = createListenerMiddleware();

// Persist the basket to localStorage whenever it changes, keeping the
// reducers themselves free of side effects.
listenerMiddleware.startListening({
  matcher: isAnyOf(setProductToBasket, setCount),
  effect: (action, listenerApi) => {
    const { products } = listenerApi.getState().basket;
    localStorage.setItem("basket", JSON.stringify(products));
  },
});
