import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import NotFound from "../views/NotFound";
import ProductDetails from "../views/ProductDetails";

function RouteConfig() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default RouteConfig;
