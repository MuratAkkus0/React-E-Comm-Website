import { apiSlice } from "./apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ productId, page = 1, pageSize = 10 }) =>
        `/products/${productId}/reviews?page=${page}&pageSize=${pageSize}`,
      providesTags: (result, error, { productId }) => [{ type: "Reviews", id: productId }],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Product", id: productId },
        { type: "Products", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewsApi;
