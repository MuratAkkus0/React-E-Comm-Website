import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../assets/css/components/product.css";
import AddToBasketBtn from "./AddToBasketBtn";
import { useDispatch } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";

function Product({ product }) {
  const { id, title, description, image, price } = product;
  const currency = "€";
  const charLimitTitle = 26;
  const charLimitDesc = 90;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = (e) => {
    e.stopPropagation();
    dispatch(setIsSearchbarActive(false));
    // Don't navigate when the click originated from the basket controls.
    if (e.target.closest("[data-basket-controls]")) return;
    navigate("/product-details/" + id);
  };
  return (
    <div onClick={handleCardClick} className="product__card--container">
      <div className="product__card--image-container flex-row-centered">
        <img className="product__card--img" src={image} alt={title} />
      </div>
      <div className="product__card--title">
        {title.length > charLimitTitle
          ? `${title.slice(0, charLimitTitle)}...`
          : title}
      </div>
      <div className="product__card--description">
        {description.length > charLimitDesc
          ? `${description.slice(0, charLimitDesc)}...`
          : description}
      </div>
      <div className="product__card--price">
        {price}
        {currency}
      </div>
      <AddToBasketBtn product={product} />
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
  }).isRequired,
};

export default Product;
