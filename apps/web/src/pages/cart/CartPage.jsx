import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatMoney } from "@ecomm/shared";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import { selectGuestCartItems } from "../../features/cart/guestCartSlice";
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../../api/cartApi";
import ProductImage from "../../components/product/ProductImage";
import QuantityStepper from "../../components/ui/QuantityStepper";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import GuestCartLine from "./GuestCartLine";
import "./cart.css";

function AuthenticatedCart() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const navigate = useNavigate();

  if (isLoading) return <Spinner label="Loading your cart" />;

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the catalog and add something you like."
        action={
          <Button as={Link} to="/">
            Continue shopping
          </Button>
        }
      />
    );
  }

  return (
    <>
      <ul className="cart-line-list">
        {cart.items.map((item) => (
          <li key={item.productId} className="cart-line">
            <div className="cart-line__image">
              <ProductImage name={item.product.name} slug={item.product.slug} size={64} />
            </div>
            <div className="cart-line__info">
              <span className="cart-line__name">{item.product.name}</span>
              <span className="cart-line__price">
                {formatMoney(item.product.priceCents, item.product.currency)}
              </span>
            </div>
            <QuantityStepper
              value={item.quantity}
              max={item.product.stock}
              onChange={(quantity) => updateCartItem({ productId: item.productId, quantity })}
            />
            <span className="cart-line__total">
              {formatMoney(item.lineTotalCents, item.product.currency)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCartItem(item.productId)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <span>Total</span>
        <strong>{formatMoney(cart.totalCents, cart.currency)}</strong>
      </div>
      <Button size="lg" onClick={() => navigate("/checkout")}>
        Proceed to checkout
      </Button>
    </>
  );
}

function GuestCart() {
  const items = useSelector(selectGuestCartItems);
  const [subtotals, setSubtotals] = useState({});

  const handleSubtotalChange = (productId, amount) => {
    setSubtotals((prev) => ({ ...prev, [productId]: amount }));
  };

  const totalCents = useMemo(
    () => Object.values(subtotals).reduce((sum, value) => sum + value, 0),
    [subtotals],
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the catalog and add something you like."
        action={
          <Button as={Link} to="/">
            Continue shopping
          </Button>
        }
      />
    );
  }

  return (
    <>
      <ul className="cart-line-list">
        {items.map((item) => (
          <GuestCartLine
            key={item.productId}
            productId={item.productId}
            quantity={item.quantity}
            onSubtotalChange={handleSubtotalChange}
          />
        ))}
      </ul>
      <div className="cart-summary">
        <span>Estimated total</span>
        <strong>{formatMoney(totalCents, "EUR")}</strong>
      </div>
      <p className="cart-summary__hint">The exact total is confirmed after you log in.</p>
      <Button as={Link} to="/login" state={{ from: { pathname: "/cart" } }} size="lg">
        Log in to checkout
      </Button>
    </>
  );
}

function CartPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <section className="page__container cart-page">
      <h1>Your cart</h1>
      {isAuthenticated ? <AuthenticatedCart /> : <GuestCart />}
    </section>
  );
}

export default CartPage;
