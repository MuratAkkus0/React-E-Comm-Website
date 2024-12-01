import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddToBasketBtn from "../components/AddToBasketBtn";
import { useEffect } from "react";
import { setSelectedProduct } from "../redux/slices/productSlice";
import "../assets/css/views/ProductDetails.css";
import { setIsBasketActive } from "../redux/slices/basketSlice";
import { MdArrowBack } from "react-icons/md";

function ProductDetails() {
  const { id } = useParams();
  const { products, selectedProduct } = useSelector((store) => store.products);
  const { title, description, image, price } = selectedProduct;
  const navigate = useNavigate();
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
      <section
        onClick={() => dispatch(setIsBasketActive(false))}
        className={`product__details--container page__container--flex-x-centered `}
      >
        <div
          className="go-back flex-row-centered"
          onClick={() => navigate("/")}
        >
          <MdArrowBack />
        </div>
        <div className="product__img--container flex-row-centered">
          <img className="product__img--img" src={image} alt="product image" />
        </div>
        <div className="product__details">
          <div className="product__details--title">{title}</div>
          <div className="product__details--description">{description}</div>
          <div className="product__details--price">{price}€</div>
          <AddToBasketBtn product={selectedProduct} />
        </div>
      </section>
    </>
  );
}

export default ProductDetails;
