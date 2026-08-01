import PropTypes from "prop-types";
import { pickPlaceholderColor } from "@ecomm/shared";

/**
 * Every product gets a coherent, deterministic placeholder instead of a
 * stock photo or a broken <img>: a palette color hashed from the
 * product's slug, with its initial rendered on top. Same product, same
 * slug, same image, every time — across catalog, detail, cart and order
 * views.
 */
function ProductImage({ name, slug, size = 96 }) {
  const color = pickPlaceholderColor(slug || name || "product");
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      className="product-image"
    >
      <rect width="100" height="100" rx="12" fill={color} />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="42"
        fontFamily="Poppins, sans-serif"
        fontWeight="700"
        fill="rgba(255,255,255,0.92)"
      >
        {initial}
      </text>
    </svg>
  );
}

ProductImage.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string,
  size: PropTypes.number,
};

export default ProductImage;
