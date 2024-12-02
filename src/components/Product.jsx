import { useNavigate } from "react-router-dom";
import "../assets/css/components/product.css";
import AddToBasketBtn from "./AddToBasketBtn";
import { useDispatch } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";
import { setIsBasketActive } from "../redux/slices/basketSlice";

function Product({ product }) {
  const { id, title, description, image, price, category } = product;
  const currency = "€";
  const charLimitTitle = 26;
  const charLimitDesc = 90;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = (e) => {
    e.stopPropagation();
    dispatch(setIsSearchbarActive(false));
    console.log("first");
    //event Delegation
    let el = e.target.tagName;
    if (el != "BUTTON" && el != "svg" && el != "SPAN") {
      navigate("/product-details/" + id);
      dispatch(setIsBasketActive(false));
    }
  };
  return (
    <div onClick={handleCardClick} className="product__card--container">
      <div className="product__card--image-container flex-row-centered">
        <img className="product__card--img" src={image} alt="product image" />
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

export default Product;
