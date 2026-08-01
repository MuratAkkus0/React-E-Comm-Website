import ProductList from "../components/ProductList";
import "../assets/css/views/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";
import { useHeaderAutoHide } from "../hooks/useHeaderAutoHide.js";

function Home() {
  const { isDarkTheme } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const handleHeaderScroll = useHeaderAutoHide();

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setIsSearchbarActive(false));
  };

  function handleScroll(e) {
    handleHeaderScroll(e.target.scrollTop);
  }

  return (
    <>
      <section
        onScroll={handleScroll}
        onClick={handleClick}
        className={`page__container--grid product__list--container ${
          isDarkTheme ? "dark-theme" : ""
        }`}
      >
        <ProductList />
      </section>
    </>
  );
}

export default Home;
