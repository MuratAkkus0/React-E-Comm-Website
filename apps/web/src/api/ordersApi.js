import { apiSlice } from "./apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Cart", "Orders", { type: "Products", id: "LIST" }],
    }),
    getOrders: builder.query({
      query: ({ page = 1, pageSize = 10 } = {}) => `/orders?page=${page}&pageSize=${pageSize}`,
      providesTags: ["Orders"],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      transformResponse: (response) => response.order,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    payOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/pay`, method: "POST" }),
      invalidatesTags: (result, error, id) => [{ type: "Order", id }, "Orders", "AdminOrders", "AdminStats"],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "PATCH" }),
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        "Orders",
        "AdminOrders",
        "AdminStats",
        { type: "Products", id: "LIST" },
      ],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/orders/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }, "Orders", "AdminOrders", "AdminStats"],
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  usePayOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
