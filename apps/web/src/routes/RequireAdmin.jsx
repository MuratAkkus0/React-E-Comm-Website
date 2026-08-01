import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthStatus, selectIsAdmin } from "../features/auth/authSlice";
import Spinner from "../components/ui/Spinner";
import RequireAuth from "./RequireAuth";

function RequireAdmin({ children }) {
  const status = useSelector(selectAuthStatus);
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <RequireAuth>
      {status === "loading" ? (
        <Spinner label="Checking your session" />
      ) : isAdmin ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </RequireAuth>
  );
}

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdmin;
