import { Link } from "react-router-dom";
import { PiShoppingBagOpenFill } from "react-icons/pi";

function Logo() {
  return (
    <Link to="/" className="logo">
      <PiShoppingBagOpenFill aria-hidden="true" />
      <span>E-Shop</span>
    </Link>
  );
}

export default Logo;
