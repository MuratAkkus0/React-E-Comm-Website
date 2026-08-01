import { Router } from "express";
import { checkoutSchema, paginationQuerySchema, updateOrderStatusSchema } from "@ecomm/shared";
import { validateBody, validateQuery } from "../../middleware/validate.middleware.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";
import * as ordersController from "./orders.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/", validateBody(checkoutSchema), ordersController.checkout);
router.get("/", validateQuery(paginationQuerySchema), ordersController.list);
router.get("/:id", ordersController.getOne);
router.post("/:id/pay", ordersController.pay);
router.patch("/:id/cancel", ordersController.cancel);
router.patch(
  "/:id/status",
  requireAdmin,
  validateBody(updateOrderStatusSchema),
  ordersController.updateStatus,
);

export default router;
