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

function AddToBasketBtn({ product }) {
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
      <ItemAmountBtn count={count} setCount={setCount} />
      <button onClick={AddToBasket} className="add__basket--btn">
        <SlBasket className="add__basket--icon" /> Add to cart
      </button>
    </div>
  );
}

export default AddToBasketBtn;
