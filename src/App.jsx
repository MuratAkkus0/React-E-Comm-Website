import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "./redux/slices/productSlice";
import RouteConfig from "./config/RouterConfig";
import { FallingLines } from "react-loader-spinner";
import { setIsPageLoading } from "./redux/slices/appSlice";
import BasketDrawer from "./components/BasketDrawer";
import { Toaster } from "sonner";

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
      <Toaster closeButton position="top-right" expand={false} richColors />
      <Header />
      <RouteConfig />
      <BasketDrawer />
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
