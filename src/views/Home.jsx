import ProductList from "../components/productList";
import "../assets/css/views/Home.css";
import { useSelector } from "react-redux";

function Home() {
  const { isDarkTheme } = useSelector((store) => store.app);
  return (
    <>
      <section className={`page__container ${isDarkTheme ? "dark-theme" : ""}`}>
        <ProductList />
      </section>
    </>
  );
}

export default Home;
