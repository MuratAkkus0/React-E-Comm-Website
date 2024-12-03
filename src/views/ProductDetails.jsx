import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddToBasketBtn from "../components/AddToBasketBtn";
import { useEffect } from "react";
import { setSelectedProduct } from "../redux/slices/productSlice";
import "../assets/css/views/ProductDetails.css";
import { MdArrowBack } from "react-icons/md";
import { checkHeaderVisibility } from "../helpers/headerHide.js";

function ProductDetails() {
  const { id } = useParams();
  const { products, selectedProduct } = useSelector((store) => store.products);
  const { title, description, image, price } = selectedProduct;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    checkHeaderVisibility(0);
  }, []);

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
  function handleScroll(e) {
    checkHeaderVisibility(e.target.scrollTop);
  }

  return (
    <>
      <section
        onScroll={handleScroll}
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
          <AddToBasketBtn
            styles={{
              iconSize: "1.4rem",
              btnFontSize: "1rem",
              amountBtnFontSize: "2rem",
              amountFontSize: "1.2rem",
            }}
            product={selectedProduct}
          />
        </div>
      </section>
    </>
  );
}

export default ProductDetails;
