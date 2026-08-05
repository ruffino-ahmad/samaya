import express from "express";

import authController from "../controllers/auth-controller";
import { validate } from "../middlewares/validate";
import authMiddleware from "../middlewares/auth-middleware";
import {
  loginValidateSchema,
  registerValidateSchema,
} from "../validations/auth-validation.js";

const router = express.Router();

router.post(
  "/auth/register",
  validate(registerValidateSchema),
  authController.register,
);

router.post("/auth/login", validate(loginValidateSchema), authController.login);
router.get("/auth/me", authMiddleware, authController.me);

export default router;
