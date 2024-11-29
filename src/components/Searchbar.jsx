import { MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";

function Searchbar() {
  const { isSearchbarActive } = useSelector((store) => store.app);

  const { isDarkTheme } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  return (
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
  );
}

export default Searchbar;
