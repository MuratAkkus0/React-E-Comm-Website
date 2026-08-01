import { useSelector } from "react-redux";
import Product from "./Product";

function ProductList() {
  const { products } = useSelector((store) => store.products);
  const { searchQuery } = useSelector((store) => store.app);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = normalizedQuery
    ? (products ?? []).filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
      )
    : products ?? [];

  if (normalizedQuery && filteredProducts.length === 0) {
    return (
      <div className="product__list--empty">
        No products match &quot;{searchQuery}&quot;.
      </div>
    );
  }

  return (
    <>
      {filteredProducts.map((item) => (
        <Product key={item.id} product={item} />
      ))}
    </>
  );
}

export default ProductList;
