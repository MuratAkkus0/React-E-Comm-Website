import { apiSlice } from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),
    getAdminOrders: builder.query({
      query: ({ page = 1, pageSize = 10, status } = {}) => {
        const params = new URLSearchParams({ page, pageSize });
        if (status) params.set("status", status);
        return `/admin/orders?${params.toString()}`;
      },
      providesTags: ["AdminOrders"],
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetAdminOrdersQuery } = adminApi;
