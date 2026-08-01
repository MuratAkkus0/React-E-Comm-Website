import { Router } from "express";
import {
  adjustStockSchema,
  createProductSchema,
  productQuerySchema,
  updateProductSchema,
} from "@ecomm/shared";
import { validateBody, validateQuery } from "../../middleware/validate.middleware.js";
import { requireAuth, requireAdmin, optionalAuth } from "../../middleware/auth.middleware.js";
import * as productsController from "./products.controller.js";

const router = Router();

router.get("/", optionalAuth, validateQuery(productQuerySchema), productsController.list);
router.get("/:idOrSlug", productsController.getOne);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createProductSchema),
  productsController.create,
);
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(updateProductSchema),
  productsController.update,
);
router.patch(
  "/:id/stock",
  requireAuth,
  requireAdmin,
  validateBody(adjustStockSchema),
  productsController.adjustStock,
);
router.delete("/:id", requireAuth, requireAdmin, productsController.remove);

export default router;
