import PropTypes from "prop-types";
import "./ui.css";

function Skeleton({ width, height = "1rem", radius = "var(--radius-sm)", className = "" }) {
  return (
    <span
      className={`ui-skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.string,
  className: PropTypes.string,
};

export default Skeleton;
