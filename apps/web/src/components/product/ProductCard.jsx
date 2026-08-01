import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatMoney } from "@ecomm/shared";
import ProductImage from "./ProductImage";
import StockBadge from "./StockBadge";
import "./product.css";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card__image">
        <ProductImage name={product.name} slug={product.slug} size={140} />
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category?.name}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <span className="product-card__price">
            {formatMoney(product.priceCents, product.currency)}
          </span>
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    priceCents: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    category: PropTypes.shape({ name: PropTypes.string }),
  }).isRequired,
};

export default ProductCard;
