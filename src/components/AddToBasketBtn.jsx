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
    try {
      dispatch(setProductToBasket(basketItem));
      dispatch(setTotalAmount());
      setCount(0);
    } catch (error) {
      toast.error("An error occured during adding item to basket.");
      throw new Error("An error occured during adding item to basket.");
    }
  };

  return (
    <div className="add__basket--container flex-row-centered">
      <ItemAmountBtn
        styles={{ iconSize: "2rem", fontSize: "1.2rem" }}
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
