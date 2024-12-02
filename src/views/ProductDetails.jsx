import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddToBasketBtn from "../components/AddToBasketBtn";
import { useEffect } from "react";
import { setSelectedProduct } from "../redux/slices/productSlice";

function ProductDetails() {
  const { id } = useParams();
  const { products, selectedProduct } = useSelector((store) => store.products);
  const { title, description, image, price } = selectedProduct;

  const dispatch = useDispatch();

  useEffect(() => {
    getProductById();
  }, [products]);

  function getProductById() {
    products &&
      products.find((product) => {
        if (product.id == id) {
          dispatch(setSelectedProduct(product));
          return;
        }
      });
  }

  return (
    <>
      <section className={`page__container--flex-x-centered `}>
        <div className="product__img--container">
          <img
            className="product__img--img"
            src={image}
            alt="product image"
            width={300}
          />
        </div>
        <div className="product__details">
          <div className="product__details--title">{title}</div>
          <div className="product__details--description">{description}</div>
          <div className="product__details--price">{price}</div>
          <AddToBasketBtn product={selectedProduct} />
        </div>
      </section>
    </>
  );
}

export default ProductDetails;
