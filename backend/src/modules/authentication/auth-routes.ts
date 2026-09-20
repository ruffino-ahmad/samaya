import express from "express";

import authController from "./auth-controller";

import { validate } from "../../middlewares/validate";
import authMiddleware from "../../middlewares/auth-middleware";
import {
  activationCodeSchema,
  loginValidateSchema,
  registerValidateSchema,
} from "./auth-validation";

const router = express.Router();

router.post(
  "/register",
  validate(registerValidateSchema),
  authController.register,
);

router.post("/login", validate(loginValidateSchema), authController.login);

router.get("/me", authMiddleware, authController.me);

router.post(
  "/activation",
  validate(activationCodeSchema),
  authController.activationAccount,
);

export default router;
