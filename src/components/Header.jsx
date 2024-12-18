import { CiShoppingBasket } from "react-icons/ci";
import Logo from "./Logo";
import "../assets/css/components/header.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";
import Searchbar from "./Searchbar";
import ChangeThemeBtn from "./ChangeThemeBtn";
import { setIsBasketActive } from "../redux/slices/basketSlice";
import BasketItemCount from "./BasketItemCount";
import { useEffect, useState } from "react";

function Header() {
  const { isDarkTheme } = useSelector((store) => store.app);
  const { isBasketActive, products } = useSelector((store) => store.basket);
  const dispatch = useDispatch();

  const [basketItemCount, setBasketItemCount] = useState(0);

  useEffect(() => {
    setBasketItemCount(products.length);
  }, [products]);

  const handleClick = (event) => {
    event.stopPropagation();
    console.log(event.target.tagName);
    //open basket
    if (!event.target.closest("#basketIcon")) {
      dispatch(setIsBasketActive(false));
      return;
    }
    // close searchbar
    if (!event.target.closest("#headerSearchInput")) {
      dispatch(setIsSearchbarActive(false));
      return;
    }
  };

  return (
    <>
      <header onClick={handleClick} className={isDarkTheme ? "dark-theme" : ""}>
        <div className="header__logo--container flex-column-centered">
          <Logo />
        </div>
        <div className="header__controls--container flex-row-centered">
          <ChangeThemeBtn />
          <Searchbar onClick={(e) => e.stopPropagation()} />
          <div className="card__icon--container">
            <BasketItemCount count={basketItemCount} />
            <CiShoppingBasket
              id="basketIcon"
              onClick={(e) => {
                console.log(e.target);
                dispatch(setIsBasketActive());
              }}
              style={{ zIndex: "4" }}
              className="card__icon icon-clickable"
            />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
