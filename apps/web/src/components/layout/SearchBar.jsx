import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const SEARCH_DEBOUNCE_MS = 350;

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(location.pathname === "/" ? searchParams.get("search") ?? "" : "");

  useEffect(() => {
    if (location.pathname === "/") {
      setValue(searchParams.get("search") ?? "");
    }
    // Only re-sync from the URL when navigating onto/around the catalog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = value.trim();
      const params = new URLSearchParams(location.pathname === "/" ? searchParams : undefined);
      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
      params.delete("page");
      navigate(`/?${params.toString()}`, { replace: true });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <label className="search-bar">
      <MdSearch className="search-bar__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="search-bar__input"
      />
    </label>
  );
}

export default SearchBar;
