import { useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "@ecomm/shared";
import { useGetAdminOrdersQuery } from "../../api/adminApi";
import { useUpdateOrderStatusMutation } from "../../api/ordersApi";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";

const STATUS_FILTERS = ["", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const NEXT_STATUS = {
  PAID: "SHIPPED",
  SHIPPED: "DELIVERED",
};

function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminOrdersQuery({ page, pageSize: 20, status: status || undefined });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  async function handleAdvance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateOrderStatus({ id: order.id, status: next }).unwrap();
      toast.success(`Order #${order.id} moved to ${next}.`);
    } catch (error) {
      toast.error(error?.data?.message ?? "Could not update order status.");
    }
  }

  return (
    <div>
      <div className="admin-form">
        <label htmlFor="status-filter" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
          Filter by status
        </label>
        <select
          id="status-filter"
          className="ui-select"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option || "all"} value={option}>
              {option || "All"}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner label="Loading orders" />
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.name ?? order.user?.email}</td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>{formatMoney(order.totalCents, order.currency)}</td>
                    <td>
                      {NEXT_STATUS[order.status] ? (
                        <Button size="sm" onClick={() => handleAdvance(order)}>
                          Mark {NEXT_STATUS[order.status]}
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default AdminOrdersPage;
