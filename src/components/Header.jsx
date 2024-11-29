import { CiShoppingBasket } from "react-icons/ci";
import Logo from "./Logo";
import "../assets/css/components/header.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkTheme, setIsSearchbarActive } from "../redux/slices/appSlice";
import Searchbar from "./Searchbar";
import ChangeThemeBtn from "./ChangeThemeBtn";

function Header() {
  const { isDarkTheme } = useSelector((store) => store.app);

  const dispatch = useDispatch();

  const closeSearchbar = (event) => {
    event.stopPropagation();
    if (event.target.closest(".header__search--container")) {
      return;
    }
    dispatch(setIsSearchbarActive(false));
  };

  return (
    <>
      <header
        onClick={closeSearchbar}
        className={isDarkTheme ? "dark-theme" : ""}
      >
        <div className="header__logo--container flex-column-centered">
          <Logo />
        </div>
        <div className="header__controls--container flex-row-centered">
          <ChangeThemeBtn />
          <Searchbar />
          <CiShoppingBasket className="card__icon icon-clickable" />
        </div>
      </header>
    </>
  );
}

export default Header;
