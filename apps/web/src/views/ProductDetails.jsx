import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddToBasketBtn from "../components/AddToBasketBtn";
import { useEffect } from "react";
import { setSelectedProduct } from "../redux/slices/productSlice";
import "../assets/css/views/ProductDetails.css";
import { MdArrowBack } from "react-icons/md";
import { useHeaderAutoHide } from "../hooks/useHeaderAutoHide.js";

function ProductDetails() {
  const { id } = useParams();
  const { products, selectedProduct } = useSelector((store) => store.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHeaderScroll = useHeaderAutoHide();

  useEffect(() => {
    handleHeaderScroll(0);
  }, [handleHeaderScroll]);

  useEffect(() => {
    const matchedProduct = products.find((product) => product.id == id);
    if (matchedProduct) {
      dispatch(setSelectedProduct(matchedProduct));
    }
  }, [products, id, dispatch]);

  function handleScroll(e) {
    handleHeaderScroll(e.target.scrollTop);
  }

  if (!selectedProduct) {
    return (
      <section className="product__details--container page__container--flex-x-centered">
        Loading product...
      </section>
    );
  }

  const { title, description, image, price } = selectedProduct;

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
          <img className="product__img--img" src={image} alt={title} />
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
