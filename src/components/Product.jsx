import "../assets/css/components/product.css";

function Product({ title, description, image, price, category }) {
  const charLimit = 90;
  return (
    <div className="product__card--container">
      <div className="product__card--image-container flex-row-centered">
        <img className="product__card--img" src={image} alt="product image" />
      </div>
      <div className="product__card--title">{title}</div>
      <div className="product__card--description">
        {description.length > charLimit
          ? `${description.slice(0, charLimit)}...`
          : description}
      </div>
      <div className="product__card--price">{price}</div>
    </div>
  );
}

export default Product;
