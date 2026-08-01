import { Router } from "express";
import { loginSchema, registerSchema } from "@ecomm/shared";
import { validateBody } from "../../middleware/validate.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimit.middleware.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.use(authRateLimiter);

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
