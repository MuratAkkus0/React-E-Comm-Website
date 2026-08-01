import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { formatMoney } from "@ecomm/shared";
import { useGetProductQuery } from "../../api/productsApi";
import { guestItemQuantitySet, guestItemRemoved } from "../../features/cart/guestCartSlice";
import ProductImage from "../../components/product/ProductImage";
import QuantityStepper from "../../components/ui/QuantityStepper";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";

function GuestCartLine({ productId, quantity, onSubtotalChange }) {
  const { data: product, isLoading } = useGetProductQuery(productId);
  const dispatch = useDispatch();

  const lineTotalCents = product ? product.priceCents * quantity : 0;

  useEffect(() => {
    onSubtotalChange(productId, lineTotalCents);
    return () => onSubtotalChange(productId, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, lineTotalCents]);

  if (isLoading) {
    return <Skeleton height="5rem" />;
  }

  if (!product) return null;

  return (
    <li className="cart-line">
      <div className="cart-line__image">
        <ProductImage name={product.name} slug={product.slug} size={64} />
      </div>
      <div className="cart-line__info">
        <span className="cart-line__name">{product.name}</span>
        <span className="cart-line__price">{formatMoney(product.priceCents, product.currency)}</span>
      </div>
      <QuantityStepper
        value={quantity}
        max={product.stock}
        onChange={(next) => dispatch(guestItemQuantitySet({ productId, quantity: next }))}
      />
      <span className="cart-line__total">{formatMoney(lineTotalCents, product.currency)}</span>
      <Button variant="ghost" size="sm" onClick={() => dispatch(guestItemRemoved(productId))}>
        Remove
      </Button>
    </li>
  );
}

GuestCartLine.propTypes = {
  productId: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onSubtotalChange: PropTypes.func.isRequired,
};

export default GuestCartLine;
