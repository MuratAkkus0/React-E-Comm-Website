import { FaSun } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkTheme } from "../redux/slices/appSlice";

function ChangeThemeBtn() {
  const { isDarkTheme } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => dispatch(setIsDarkTheme())}
      style={
        isDarkTheme
          ? {
              justifyContent: "left",
              backgroundColor: "white",
            }
          : {}
      }
      className={`change__thema--container ${isDarkTheme ? "dark-theme" : ""}`}
    >
      {isDarkTheme ? (
        <MdDarkMode
          className={`thema__icon icon-clickable ${
            isDarkTheme ? "thema__icon--dark" : ""
          } `}
        />
      ) : (
        <FaSun className="thema__icon icon-clickable" />
      )}
    </div>
  );
}

export default ChangeThemeBtn;
