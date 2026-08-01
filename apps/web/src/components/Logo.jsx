import { PiShoppingBagOpenFill } from "react-icons/pi";
import "../assets/css/components/logo.css";
import { useNavigate } from "react-router-dom";
function Logo() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      style={{ cursor: "pointer" }}
      className="logo--container flex-column-centered"
    >
      <PiShoppingBagOpenFill className="logo" />
      <span className="logo__text">E-Shop</span>
    </div>
  );
}

export default Logo;
