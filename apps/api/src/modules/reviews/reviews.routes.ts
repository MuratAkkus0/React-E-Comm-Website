import { Router } from "express";
import { createReviewSchema, paginationQuerySchema } from "@ecomm/shared";
import { validateBody, validateQuery } from "../../middleware/validate.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as reviewsController from "./reviews.controller.js";

// Mounted at /api/products/:productId/reviews (mergeParams: true).
const router = Router({ mergeParams: true });

router.get("/", validateQuery(paginationQuerySchema), reviewsController.list);
router.post("/", requireAuth, validateBody(createReviewSchema), reviewsController.create);

export default router;
