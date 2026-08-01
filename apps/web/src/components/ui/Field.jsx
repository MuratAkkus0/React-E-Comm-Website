import PropTypes from "prop-types";
import { useId } from "react";
import "./ui.css";

function Field({ label, error, hint, children }) {
  const id = useId();
  const child = typeof children === "function" ? children(id) : children;

  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      {child}
      {hint && !error ? <p className="ui-field__hint">{hint}</p> : null}
      {error ? (
        <p className="ui-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default Field;
