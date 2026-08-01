import { formatMoney } from "@ecomm/shared";
import { useGetAdminStatsQuery } from "../../api/adminApi";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";

function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useGetAdminStatsQuery();

  if (isLoading) return <Spinner label="Loading dashboard" />;
  if (isError || !data) {
    return <ErrorState description="Could not load admin stats." onRetry={refetch} />;
  }

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Revenue (paid+)</span>
          <span className="admin-stat-card__value">{formatMoney(data.revenueCents, "EUR")}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Products</span>
          <span className="admin-stat-card__value">{data.productCount}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Users</span>
          <span className="admin-stat-card__value">{data.userCount}</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Low stock products</span>
          <span className="admin-stat-card__value">{data.lowStockCount}</span>
        </div>
        {Object.entries(data.ordersByStatus).map(([status, count]) => (
          <div className="admin-stat-card" key={status}>
            <span className="admin-stat-card__label">Orders: {status}</span>
            <span className="admin-stat-card__value">{count}</span>
          </div>
        ))}
      </div>

      {data.lowStockProducts.length > 0 ? (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <caption style={{ textAlign: "left", marginBottom: "0.5rem", fontWeight: 700 }}>
              Low stock products
            </caption>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStockProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default AdminDashboardPage;
