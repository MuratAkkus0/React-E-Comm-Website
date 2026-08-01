import PropTypes from "prop-types";
import "../assets/css/components/basketItemCount.css";
function BasketItemCount({ count }) {
  return <div className="count--container">{count}</div>;
}

BasketItemCount.propTypes = {
  count: PropTypes.number.isRequired,
};

export default BasketItemCount;
