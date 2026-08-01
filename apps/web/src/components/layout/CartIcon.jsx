import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiShoppingBasket } from "react-icons/ci";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import { selectGuestCartItems } from "../../features/cart/guestCartSlice";
import { useGetCartQuery } from "../../api/cartApi";

function CartIcon() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const guestItems = useSelector(selectGuestCartItems);
  const { data: serverCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const count = isAuthenticated
    ? (serverCart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
    : guestItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className="cart-icon" aria-label={`Cart, ${count} item(s)`}>
      <CiShoppingBasket aria-hidden="true" />
      {count > 0 ? <span className="cart-icon__count">{count}</span> : null}
    </Link>
  );
}

export default CartIcon;
