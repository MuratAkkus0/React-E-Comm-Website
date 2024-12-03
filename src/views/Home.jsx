import ProductList from "../components/ProductList";
import "../assets/css/views/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";
import { checkHeaderVisibility } from "../helpers/headerHide.js";

function Home() {
  const { isDarkTheme } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation();
    console.log("rst");
    dispatch(setIsSearchbarActive(false));
  };

  function handleScroll(e) {
    checkHeaderVisibility(e.target.scrollTop);
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
