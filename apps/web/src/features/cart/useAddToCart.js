import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { selectIsAuthenticated } from "../auth/authSlice";
import { guestItemAdded } from "./guestCartSlice";
import { useAddCartItemMutation } from "../../api/cartApi";

/**
 * Adding to cart works the same way from the UI's perspective whether the
 * shopper is signed in (server-side cart) or anonymous (localStorage cart,
 * merged into the server cart on login — see redux/listenerMiddleware.js).
 */
export function useAddToCart() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [addCartItem, { isLoading }] = useAddCartItemMutation();
  const dispatch = useDispatch();

  async function addToCart(productId, quantity, productName) {
    if (isAuthenticated) {
      try {
        await addCartItem({ productId, quantity }).unwrap();
        toast.success(`Added ${productName ?? "product"} to your cart.`);
      } catch (error) {
        toast.error(error?.data?.message ?? "Could not add this product to your cart.");
      }
      return;
    }

    dispatch(guestItemAdded({ productId, quantity }));
    toast.success(`Added ${productName ?? "product"} to your cart.`);
  }

  return { addToCart, isLoading };
}
