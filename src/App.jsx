import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "./redux/slices/productSlice";
import RouteConfig from "./config/RouterConfig";
import { FallingLines } from "react-loader-spinner";
import { setIsPageLoading } from "./redux/slices/appSlice";

function App() {
  const { isPageLoading } = useSelector((store) => store.app);
  const { isProductLoading } = useSelector((store) => store.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(setIsPageLoading());
  }, []);

  return (
    <>
      <Header />
      <RouteConfig />
      {isPageLoading || isProductLoading ? (
        <div className="app__spinner">
          <FallingLines
            color="black"
            width="100"
            visible={true}
            ariaLabel="falling-circles-loading"
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default App;