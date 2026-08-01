import { Link, useSearchParams } from "react-router-dom";
import { formatMoney } from "@ecomm/shared";
import { useGetOrdersQuery } from "../../api/ordersApi";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import "./orders.css";

function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const { data, isLoading, isError, refetch } = useGetOrdersQuery({ page, pageSize: 10 });

  if (isLoading) return <Spinner label="Loading your orders" />;
  if (isError) {
    return (
      <section className="page__container">
        <ErrorState description="We couldn't load your orders." onRetry={refetch} />
      </section>
    );
  }

  if (data.items.length === 0) {
    return (
      <section className="page__container">
        <EmptyState
          title="You haven't placed any orders yet"
          description="Your order history will show up here."
          action={
            <Button as={Link} to="/">
              Start shopping
            </Button>
          }
        />
      </section>
    );
  }

  return (
    <section className="page__container orders-page">
      <h1>Your orders</h1>
      <ul className="orders-list">
        {data.items.map((order) => (
          <li key={order.id} className="orders-list__item">
            <Link to={`/orders/${order.id}`} className="orders-list__link">
              <div>
                <span className="orders-list__id">Order #{order.id}</span>
                <span className="orders-list__date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="orders-list__total">
                {formatMoney(order.totalCents, order.currency)}
              </span>
              <OrderStatusBadge status={order.status} />
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={(next) => setSearchParams({ page: String(next) })}
      />
    </section>
  );
}

export default OrdersPage;
