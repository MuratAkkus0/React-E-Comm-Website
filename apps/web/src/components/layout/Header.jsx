import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import CartIcon from "./CartIcon";
import UserMenu from "./UserMenu";
import "./layout.css";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Logo />
        <SearchBar />
        <div className="site-header__controls">
          <ThemeToggle />
          <CartIcon />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
