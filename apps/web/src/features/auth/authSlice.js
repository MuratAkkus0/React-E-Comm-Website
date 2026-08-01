import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  // "loading" until the initial silent-refresh attempt on app boot
  // resolves, so routes can avoid a flash of logged-out content.
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    credentialsSet: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
    },
    credentialsCleared: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "anonymous";
    },
  },
});

export const { credentialsSet, credentialsCleared } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsAdmin = (state) => state.auth.user?.role === "ADMIN";
