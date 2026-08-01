import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSearchbarActive,
  setSearchQuery,
} from "../redux/slices/appSlice";
import "../assets/css/components/searchbar.css";

const SEARCH_DEBOUNCE_MS = 300;

function Searchbar() {
  const { isSearchbarActive, isDarkTheme, searchQuery } = useSelector(
    (store) => store.app
  );
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(inputValue.trim()));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [inputValue, dispatch]);

  return (
    <div className="search--container" id="headerSearchInput">
      <MdSearch
        id="searchIcon"
        onClick={() => dispatch(setIsSearchbarActive())}
        className="search__icon icon-clickable"
      />
      <input
        id="searchInput"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="search..."
        aria-label="Search products"
        className={`${
          isSearchbarActive ? "search--input search-active" : "search--input"
        } ${isDarkTheme ? "dark-theme" : ""}`}
      />
    </div>
  );
}

export default Searchbar;
