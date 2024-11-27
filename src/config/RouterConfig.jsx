import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import NotFound from "../views/NotFound";

function RouteConfig() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default RouteConfig;
