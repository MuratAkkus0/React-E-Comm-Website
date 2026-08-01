import PropTypes from "prop-types";
import Badge from "../ui/Badge";

const TONE_BY_STATUS = {
  PENDING: "warning",
  PAID: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
};

function OrderStatusBadge({ status }) {
  return <Badge tone={TONE_BY_STATUS[status] ?? "neutral"}>{status}</Badge>;
}

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default OrderStatusBadge;
