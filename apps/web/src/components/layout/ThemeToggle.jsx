import { FaSun } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { themeToggled } from "../../redux/slices/uiSlice";

function ThemeToggle() {
  const isDarkTheme = useSelector((state) => state.ui.isDarkTheme);
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => dispatch(themeToggled())}
      aria-pressed={isDarkTheme}
      aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDarkTheme ? <MdDarkMode aria-hidden="true" /> : <FaSun aria-hidden="true" />}
    </button>
  );
}

export default ThemeToggle;
