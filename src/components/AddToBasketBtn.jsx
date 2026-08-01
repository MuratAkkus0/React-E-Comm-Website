import { useState } from "react";
import "../assets/css/components/addToBasketBtn.css";

import { SlBasket } from "react-icons/sl";
import { useDispatch } from "react-redux";
import {
  setProductToBasket,
  setTotalAmount,
} from "../redux/slices/basketSlice";
import ItemAmountBtn from "./ItemAmountBtn";
import { toast } from "sonner";

function AddToBasketBtn({ product, styles }) {
  const { id, title, image, price } = product;
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const basketItem = {
    id,
    title,
    image,
    price,
    count: count,
  };

  const AddToBasket = () => {
    if (count === 0) {
      toast.info("Please select product quantity first.");
      return;
    }
    try {
      dispatch(setProductToBasket(basketItem));
      dispatch(setTotalAmount());
      toast.success("Product successfully added to basket.");
      setCount(0);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while adding the item to the basket."
      );
    }
  };

  return (
    <div
      data-basket-controls
      className="add__basket--container flex-row-centered"
    >
      <ItemAmountBtn
        styles={
          styles && {
            iconSize: styles.amountBtnFontSize,
            fontSize: styles.amountFontSize,
          }
        }
        count={count}
        setCount={setCount}
      />
      <button
        onClick={AddToBasket}
        style={styles && { fontSize: styles.btnFontSize }}
        className="add__basket--btn"
      >
        <SlBasket
          style={styles && { fontSize: styles.iconSize }}
          className="add__basket--icon"
        />{" "}
        Add to cart
      </button>
    </div>
  );
}

export default AddToBasketBtn;
