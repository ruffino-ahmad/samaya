import type { Request, Response } from "express";

import uploadService from "./upload.service";

import {
  requestUploadUrlSchema,
  confirmUploadSchema,
} from "./upload.validation";
import { Errors } from "ds-express-errors";
import { de } from "zod/v4/locales";

const requestUploadUrl = async (req: Request, res: Response) => {
  const { fileName, contentType } = req.body;

  const result = await uploadService.generateUploadUrl({
    fileName,
    contentType,
  });

  res.status(200).json({
    uploadUrl: result.uploadUrl,
    blobName: result.blobName,
    expiresAt: result.expiresAt,
  });
};

const confirmUpload = async (req: Request, res: Response) => {
  const { blobName } = req.body;

  const validation = await uploadService.validateUploadedBlob(blobName);
  if (!validation.isValid) {
    throw Errors.BadRequest(validation.reason ?? "Invalid file");
  }

  res.status(200).json({
    message: "Upload confirmed",
    blobName,
  });
};

export default {
  requestUploadUrl,
  confirmUpload,
};
