import { MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";
import "../assets/css/components/searchbar.css";

function Searchbar() {
  const { isSearchbarActive } = useSelector((store) => store.app);
  const { isDarkTheme } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  return (
    <div className="search--container" id="headerSearchInput">
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
          isSearchbarActive ? "search--input search-active" : "search--input"
        } ${isDarkTheme ? "dark-theme" : ""}`}
      />
    </div>
  );
}

export default Searchbar;
