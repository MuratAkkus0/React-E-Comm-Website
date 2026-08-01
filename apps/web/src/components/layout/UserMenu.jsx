import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { selectCurrentUser, selectIsAdmin, selectIsAuthenticated } from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../api/authApi";
import Button from "../ui/Button";

function UserMenu() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectCurrentUser);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("You have been signed out.");
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="user-menu">
        <Link to="/login" className="user-menu__link">
          Log in
        </Link>
        <Link to="/register" className="user-menu__link user-menu__link--primary">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <span className="user-menu__greeting">Hi, {user?.name?.split(" ")[0]}</span>
      <Link to="/orders" className="user-menu__link">
        Orders
      </Link>
      {isAdmin ? (
        <Link to="/admin" className="user-menu__link">
          Admin
        </Link>
      ) : null}
      <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={isLoading}>
        Log out
      </Button>
    </div>
  );
}

export default UserMenu;
