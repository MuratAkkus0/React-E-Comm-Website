import PropTypes from "prop-types";
import "./ui.css";

function EmptyState({ title, description, action }) {
  return (
    <div className="ui-state ui-state--empty">
      <h2 className="ui-state__title">{title}</h2>
      {description ? <p className="ui-state__description">{description}</p> : null}
      {action}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

export default EmptyState;
