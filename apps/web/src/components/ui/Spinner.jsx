import PropTypes from "prop-types";
import "./ui.css";

function Spinner({ label = "Loading" }) {
  return (
    <div className="ui-spinner" role="status" aria-live="polite">
      <span className="ui-spinner__circle" aria-hidden="true" />
      <span className="ui-visually-hidden">{label}</span>
    </div>
  );
}

Spinner.propTypes = {
  label: PropTypes.string,
};

export default Spinner;
