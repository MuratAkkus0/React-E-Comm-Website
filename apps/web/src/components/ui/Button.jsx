import PropTypes from "prop-types";
import "./ui.css";

function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...rest
}) {
  return (
    <Component
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <span className="ui-btn__spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </Component>
  );
}

Button.propTypes = {
  as: PropTypes.elementType,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

export default Button;
