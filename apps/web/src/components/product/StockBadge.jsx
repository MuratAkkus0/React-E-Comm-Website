import PropTypes from "prop-types";
import Badge from "../ui/Badge";

function StockBadge({ stock }) {
  if (stock <= 0) return <Badge tone="danger">Out of stock</Badge>;
  if (stock <= 5) return <Badge tone="warning">Only {stock} left</Badge>;
  return <Badge tone="success">In stock</Badge>;
}

StockBadge.propTypes = {
  stock: PropTypes.number.isRequired,
};

export default StockBadge;
