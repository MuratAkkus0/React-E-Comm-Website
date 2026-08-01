import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdArrowBack } from "react-icons/md";
import { formatMoney } from "@ecomm/shared";
import { useGetProductQuery } from "../api/productsApi";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { useAddToCart } from "../features/cart/useAddToCart";
import ProductImage from "../components/product/ProductImage";
import StockBadge from "../components/product/StockBadge";
import ReviewList from "../components/product/ReviewList";
import ReviewForm from "../components/product/ReviewForm";
import QuantityStepper from "../components/ui/QuantityStepper";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError, refetch } = useGetProductQuery(slug);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { addToCart, isLoading: isAdding } = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <section className="page__container product-detail">
        <Skeleton height="20rem" />
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="page__container">
        <ErrorState description="We couldn't load this product." onRetry={refetch} />
      </section>
    );
  }

  return (
    <section className="page__container product-detail">
      <Link to="/" className="product-detail__back">
        <MdArrowBack aria-hidden="true" /> Back to catalog
      </Link>

      <div className="product-detail__layout">
        <div className="product-detail__image">
          <ProductImage name={product.name} slug={product.slug} size={280} />
        </div>
        <div className="product-detail__info">
          <span className="product-detail__category">{product.category?.name}</span>
          <h1 className="product-detail__name">{product.name}</h1>
          <StockBadge stock={product.stock} />
          <p className="product-detail__description">{product.description}</p>
          <div className="product-detail__price">
            {formatMoney(product.priceCents, product.currency)}
          </div>

          {product.stock > 0 ? (
            <div className="product-detail__actions">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock}
              />
              <Button
                isLoading={isAdding}
                onClick={() => addToCart(product.id, quantity, product.name)}
              >
                Add to cart
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="product-detail__reviews">
        <h2>Reviews {product.ratingCount > 0 ? `(${product.ratingAvg.toFixed(1)} avg)` : ""}</h2>
        {isAuthenticated ? (
          <ReviewForm productId={product.id} />
        ) : (
          <p className="product-detail__review-hint">
            <Link to="/login">Log in</Link> to leave a review after purchasing this product.
          </p>
        )}
        <ReviewList productId={product.id} />
      </div>
    </section>
  );
}

export default ProductDetailPage;
