import PropTypes from "prop-types";
import "./ui.css";

function Badge({ tone = "neutral", children }) {
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}

Badge.propTypes = {
  tone: PropTypes.oneOf(["neutral", "success", "danger", "warning", "info"]),
  children: PropTypes.node,
};

export default Badge;
