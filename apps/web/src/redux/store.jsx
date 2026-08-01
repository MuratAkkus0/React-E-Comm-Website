import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import productReducer from "./slices/productSlice";
import basketReducer from "./slices/basketSlice";
import { listenerMiddleware } from "./listenerMiddleware";

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productReducer,
    basket: basketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
