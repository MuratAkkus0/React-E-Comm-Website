import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkoutSchema, formatMoney } from "@ecomm/shared";
import { useGetCartQuery } from "../api/cartApi";
import { useCheckoutMutation } from "../api/ordersApi";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [checkout, { isLoading: isSubmitting }] = useCheckoutMutation();
  const navigate = useNavigate();

  if (isLoading) return <Spinner label="Loading your cart" />;

  if (!cart || cart.items.length === 0) {
    return (
      <section className="page__container">
        <EmptyState
          title="Your cart is empty"
          description="Add products to your cart before checking out."
        />
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = checkoutSchema.safeParse({ shippingAddress });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid shipping address.");
      return;
    }
    setError("");

    try {
      const response = await checkout(result.data).unwrap();
      toast.success("Order placed. Complete payment to confirm it.");
      navigate(`/orders/${response.order.id}`);
    } catch (submitError) {
      toast.error(submitError?.data?.message ?? "Could not place your order.");
    }
  }

  return (
    <section className="page__container checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-page__layout">
        <form className="checkout-page__form" onSubmit={handleSubmit}>
          <Field label="Shipping address" error={error}>
            {(id) => (
              <textarea
                id={id}
                className="ui-textarea"
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                placeholder="Street, city, postal code, country"
                required
              />
            )}
          </Field>
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Place order
          </Button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatMoney(item.lineTotalCents, item.product.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-summary__total">
            <span>Total</span>
            <strong>{formatMoney(cart.totalCents, cart.currency)}</strong>
          </div>
          <p className="checkout-summary__note">
            The total is recalculated from current prices when your order is placed — this
            summary is for reference only.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
