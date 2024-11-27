import { PiShoppingBagOpenFill } from "react-icons/pi";
import "../assets/css/components/logo.css";
function Logo() {
  return (
    <div className="logo--container flex-column-centered">
      <PiShoppingBagOpenFill className="logo" />
      <span className="logo__text">E-Shop</span>
    </div>
  );
}

export default Logo;
