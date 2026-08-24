import express from "express";

import uploadController from "./upload.controller";

import authMiddleware from "../../middlewares/auth-middleware";
import { validate } from "../../middlewares/validate";
import {
  confirmUploadSchema,
  requestUploadUrlSchema,
} from "./upload.validation";

const router = express.Router();

router.post(
  "/uploads/request-url",
  authMiddleware,
  validate(requestUploadUrlSchema),
  uploadController.requestUploadUrl,
);

router.post(
  "/uploads/confirm",
  authMiddleware,
  validate(confirmUploadSchema),
  uploadController.confirmUpload,
);

export default router;
