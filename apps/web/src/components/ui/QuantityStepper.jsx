import PropTypes from "prop-types";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import "./ui.css";

function QuantityStepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div className="ui-stepper">
      <button
        type="button"
        className="ui-stepper__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <CiCircleMinus aria-hidden="true" />
      </button>
      <span className="ui-stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="ui-stepper__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <CiCirclePlus aria-hidden="true" />
      </button>
    </div>
  );
}

QuantityStepper.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default QuantityStepper;
