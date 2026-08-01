import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";

const TABS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
];

function AdminLayout() {
  return (
    <section className="page__container admin-layout">
      <h1>Admin</h1>
      <nav className="admin-layout__tabs">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `admin-layout__tab ${isActive ? "admin-layout__tab--active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-layout__content">
        <Outlet />
      </div>
    </section>
  );
}

export default AdminLayout;
