import { CiShoppingBasket } from "react-icons/ci";
import { FaSun } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import Logo from "./Logo";
import "../assets/css/components/header.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkTheme, setIsSearchbarActive } from "../redux/slices/appSlice";

function Header() {
  const { isSearchbarActive } = useSelector((store) => store.app);

  const { isDarkTheme } = useSelector((store) => store.app);

  const dispatch = useDispatch();

  const closeSearchbar = (e) => {
    e.stopPropagation();
    if (e.target.closest(".header__search--container")) {
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
          <div className="header__search--container">
            <MdSearch
              id="searchIcon"
              onClick={() => dispatch(setIsSearchbarActive())}
              className={`search__icon icon-clickable`}
            />
            <input
              id="searchInput"
              type="text"
              placeholder="search..."
              className={`${
                isSearchbarActive
                  ? "header__search--input search-active"
                  : "header__search--input"
              } ${isDarkTheme ? "dark-theme" : ""}`}
            />
          </div>

          <div
            onClick={() => dispatch(setIsDarkTheme())}
            style={
              isDarkTheme
                ? {
                    justifyContent: "left",
                    backgroundColor: "white",
                  }
                : {}
            }
            className={`change__thema--container ${
              isDarkTheme ? "dark-theme" : ""
            }`}
          >
            {isDarkTheme ? (
              <MdDarkMode
                className={`thema__icon icon-clickable ${
                  isDarkTheme ? "thema__icon--dark" : ""
                } `}
              />
            ) : (
              <FaSun className="thema__icon icon-clickable" />
            )}
          </div>
          <CiShoppingBasket className="icon-clickable" />
        </div>
      </header>
    </>
  );
}

export default Header;
