import { createListenerMiddleware } from "@reduxjs/toolkit";
import { credentialsSet } from "../features/auth/authSlice";
import { guestCartCleared, selectGuestCartItems } from "../features/cart/guestCartSlice";
import { cartApi } from "../api/cartApi";

export const listenerMiddleware = createListenerMiddleware();

// Folds the anonymous localStorage cart into the user's persistent
// server-side cart the moment we have valid credentials (fresh login,
// registration, or a successful silent refresh on app boot), then clears
// the local copy so it isn't merged again on a later login.
listenerMiddleware.startListening({
  actionCreator: credentialsSet,
  effect: async (action, listenerApi) => {
    const items = selectGuestCartItems(listenerApi.getState());
    if (items.length === 0) return;

    const result = await listenerApi.dispatch(
      cartApi.endpoints.mergeCart.initiate(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      ),
    );

    if (!result.error) {
      listenerApi.dispatch(guestCartCleared());
    }
  },
});
