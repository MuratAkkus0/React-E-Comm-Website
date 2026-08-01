import { useSearchParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../api/categoriesApi";
import { useGetProductsQuery } from "../api/productsApi";
import ProductCard from "../components/product/ProductCard";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";
import "./CatalogPage.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "rating_desc", label: "Top rated" },
];

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useGetCategoriesQuery();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({
    search: search || undefined,
    category: category || undefined,
    sort,
    page,
    pageSize: 12,
  });

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  }

  return (
    <section className="page__container catalog">
      <div className="catalog__toolbar">
        <div className="catalog__filter">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            className="ui-select"
            value={category}
            onChange={(event) => updateParam("category", event.target.value)}
          >
            <option value="">All categories</option>
            {(categories ?? []).map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="catalog__filter">
          <label htmlFor="sort-filter">Sort by</label>
          <select
            id="sort-filter"
            className="ui-select"
            value={sort}
            onChange={(event) => updateParam("sort", event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {search ? (
        <p className="catalog__search-summary">
          Showing results for &quot;{search}&quot;
          {data ? ` — ${data.pagination.total} product(s)` : ""}
        </p>
      ) : null}

      {isError ? (
        <ErrorState description="We couldn't load the product catalog." onRetry={refetch} />
      ) : isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }, (_, index) => index).map((index) => (
            <Skeleton key={index} height="18rem" radius="var(--radius-lg)" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try a different search term or clear your filters."
        />
      ) : (
        <>
          <div className="product-grid" aria-busy={isFetching}>
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </section>
  );
}

export default CatalogPage;
