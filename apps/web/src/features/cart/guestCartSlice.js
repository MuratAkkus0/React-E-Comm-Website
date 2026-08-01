import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "guestCart";

function readFromStorage() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// The anonymous, localStorage-backed cart. Only used while signed out —
// once a user logs in, POST /cart/merge folds these lines into their
// persistent server-side cart and this slice is cleared (see
// features/cart/useCart.js).
const guestCartSlice = createSlice({
  name: "guestCart",
  initialState: { items: readFromStorage() },
  reducers: {
    guestItemAdded: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }
      writeToStorage(state.items);
    },
    guestItemQuantitySet: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.productId !== productId);
      } else {
        const existing = state.items.find((item) => item.productId === productId);
        if (existing) existing.quantity = quantity;
      }
      writeToStorage(state.items);
    },
    guestItemRemoved: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      writeToStorage(state.items);
    },
    guestCartCleared: (state) => {
      state.items = [];
      writeToStorage(state.items);
    },
  },
});

export const { guestItemAdded, guestItemQuantitySet, guestItemRemoved, guestCartCleared } =
  guestCartSlice.actions;
export default guestCartSlice.reducer;

export const selectGuestCartItems = (state) => state.guestCart.items;
