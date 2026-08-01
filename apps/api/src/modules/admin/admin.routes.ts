import { Router } from "express";
import { paginationQuerySchema } from "@ecomm/shared";
import { validateQuery } from "../../middleware/validate.middleware.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";
import * as adminController from "./admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", adminController.stats);
router.get("/orders", validateQuery(paginationQuerySchema), adminController.listOrders);

export default router;
