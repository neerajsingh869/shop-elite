import { Router } from "express";

import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth)
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;