import { apiSlice } from "./apiSlice";

function toQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => `/products${toQueryString(params)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: "Product", id: item.id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProduct: builder.query({
      query: (idOrSlug) => `/products/${idOrSlug}`,
      transformResponse: (response) => response.product,
      providesTags: (result, error, idOrSlug) => [{ type: "Product", id: idOrSlug }],
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id: "LIST" },
        { type: "Product", id },
      ],
    }),
    adjustProductStock: builder.mutation({
      query: ({ id, delta }) => ({ url: `/products/${id}/stock`, method: "PATCH", body: { delta } }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id: "LIST" },
        { type: "Product", id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useAdjustProductStockMutation,
  useDeleteProductMutation,
} = productsApi;
