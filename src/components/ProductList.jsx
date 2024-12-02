import { useSelector } from "react-redux";
import Product from "./Product";

function ProductList() {
  const { products } = useSelector((store) => store.products);

  return (
    <>
      {products &&
        products.map((item) => <Product key={item.id} product={item} />)}
    </>
  );
}

export default ProductList;
