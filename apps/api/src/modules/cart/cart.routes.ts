import { Router } from "express";
import { cartItemInputSchema, mergeCartSchema, updateCartItemSchema } from "@ecomm/shared";
import { validateBody } from "../../middleware/validate.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as cartController from "./cart.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/items", validateBody(cartItemInputSchema), cartController.addItem);
router.patch("/items/:productId", validateBody(updateCartItemSchema), cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);
router.post("/merge", validateBody(mergeCartSchema), cartController.mergeCart);

export default router;
