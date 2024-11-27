import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "./redux/slices/productSlice";
import RouteConfig from "./config/RouterConfig";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  return (
    <>
      <Header />
      <RouteConfig />
    </>
  );
}

export default App;
