import ProductList from "../components/productList";
import "../assets/css/views/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchbarActive } from "../redux/slices/appSlice";

function Home() {
  const { isDarkTheme } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.target.tagName !== "SECTION") return;
    dispatch(setIsSearchbarActive(false));
  };
  return (
    <>
      <section
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
