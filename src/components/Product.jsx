import "../assets/css/components/product.css";

function Product({ title, description, image, price, category }) {
  const currency = "€";
  const charLimitTitle = 50;
  const charLimitDesc = 90;
  return (
    <div className="product__card--container">
      <div className="product__card--image-container flex-row-centered">
        <img className="product__card--img" src={image} alt="product image" />
      </div>
      <div className="product__card--title">
        {title.length > charLimitTitle
          ? `${title.slice(0, charLimitTitle)}...`
          : title}
      </div>
      <div className="product__card--description">
        {description.length > charLimitDesc
          ? `${description.slice(0, charLimitDesc)}...`
          : description}
      </div>
      <div className="product__card--price">
        {price}
        {currency}
      </div>
    </div>
  );
}

export default Product;
