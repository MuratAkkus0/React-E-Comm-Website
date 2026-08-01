import { Router } from "express";
import { createCategorySchema, updateCategorySchema } from "@ecomm/shared";
import { validateBody } from "../../middleware/validate.middleware.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";
import * as categoriesController from "./categories.controller.js";

const router = Router();

router.get("/", categoriesController.list);
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createCategorySchema),
  categoriesController.create,
);
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  validateBody(updateCategorySchema),
  categoriesController.update,
);
router.delete("/:id", requireAuth, requireAdmin, categoriesController.remove);

export default router;
