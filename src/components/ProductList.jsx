import { useSelector } from "react-redux";
import Product from "./Product";

function ProductList() {
  const { products } = useSelector((store) => store.products);

  return (
    <>
      {products &&
        products.map((item) => (
          <Product
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            category={item.category}
            price={item.price}
          />
        ))}
    </>
  );
}

export default ProductList;
