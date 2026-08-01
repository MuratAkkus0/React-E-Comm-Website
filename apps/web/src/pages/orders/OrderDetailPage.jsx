import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatMoney } from "@ecomm/shared";
import { useCancelOrderMutation, useGetOrderQuery, usePayOrderMutation } from "../../api/ordersApi";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import "./orders.css";

function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(Number(id));
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (isLoading) return <Spinner label="Loading order" />;
  if (isError || !order) {
    return (
      <section className="page__container">
        <ErrorState
          title="Order not found"
          description="This order doesn't exist, or doesn't belong to your account."
          onRetry={refetch}
        />
      </section>
    );
  }

  async function handlePay() {
    try {
      await payOrder(order.id).unwrap();
      toast.success("Payment successful. Your order is now confirmed.");
    } catch (error) {
      toast.error(error?.data?.message ?? "Payment failed.");
    }
  }

  async function handleCancel() {
    try {
      await cancelOrder(order.id).unwrap();
      toast.success("Order cancelled.");
    } catch (error) {
      toast.error(error?.data?.message ?? "Could not cancel this order.");
    }
  }

  const canPay = order.status === "PENDING";
  const canCancel = order.status === "PENDING" || order.status === "PAID";

  return (
    <section className="page__container order-detail">
      <Link to="/orders" className="order-detail__back">
        Back to orders
      </Link>
      <div className="order-detail__header">
        <h1>Order #{order.id}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="order-detail__meta">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>
      <p className="order-detail__meta">Shipping to: {order.shippingAddress}</p>

      <ul className="order-detail__items">
        {order.items.map((item) => (
          <li key={item.id}>
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatMoney(item.unitPriceCents * item.quantity, order.currency)}</span>
          </li>
        ))}
      </ul>

      <div className="order-detail__total">
        <span>Total</span>
        <strong>{formatMoney(order.totalCents, order.currency)}</strong>
      </div>

      <div className="order-detail__actions">
        {canPay ? (
          <Button isLoading={isPaying} onClick={handlePay}>
            Pay now (simulated)
          </Button>
        ) : null}
        {canCancel ? (
          <Button variant="secondary" isLoading={isCancelling} onClick={handleCancel}>
            Cancel order
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default OrderDetailPage;
