import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { credentialsCleared, credentialsSet } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps the base query so a single expired access token transparently
// triggers one refresh-and-retry using the httpOnly refresh cookie,
// instead of every consumer having to handle 401s individually.
let refreshPromise = null;

async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && args?.url !== "/auth/refresh") {
    refreshPromise ??= rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    ).finally(() => {
      refreshPromise = null;
    });

    const refreshResult = await refreshPromise;

    if (refreshResult.data) {
      api.dispatch(credentialsSet(refreshResult.data));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(credentialsCleared());
    }
  }

  return result;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Me",
    "Products",
    "Product",
    "Categories",
    "Reviews",
    "Cart",
    "Orders",
    "Order",
    "AdminStats",
    "AdminOrders",
  ],
  endpoints: () => ({}),
});
