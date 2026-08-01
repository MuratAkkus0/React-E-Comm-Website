import PropTypes from "prop-types";
import Button from "./Button";
import "./ui.css";

function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="ui-state ui-state--error">
      <h2 className="ui-state__title">{title}</h2>
      {description ? <p className="ui-state__description">{description}</p> : null}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorState;
