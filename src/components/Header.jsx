import { CiShoppingBasket } from "react-icons/ci";
import Logo from "./Logo";
import "../assets/css/components/header.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";
import Searchbar from "./Searchbar";
import ChangeThemeBtn from "./ChangeThemeBtn";
import { setIsBasketActive } from "../redux/slices/basketSlice";

function Header() {
  const { isDarkTheme } = useSelector((store) => store.app);
  const { isBasketActive } = useSelector((store) => store.basket);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    event.stopPropagation();
    //close basket
    if (event.target.id !== "basketIcon") {
      dispatch(setIsBasketActive(false));
      console.log(isBasketActive);
      return;
    }
    // close searchbar
    if (event.target.closest("#headerSearchInput")) {
      return;
    } else {
      dispatch(setIsSearchbarActive(false));
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
          <CiShoppingBasket
            id="basketIcon"
            onClick={() => dispatch(setIsBasketActive())}
            className="card__icon icon-clickable"
          />
        </div>
      </header>
    </>
  );
}

export default Header;
