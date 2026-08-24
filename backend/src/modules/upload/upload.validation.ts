import { z } from "zod";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const requestUploadUrlSchema = z.object({
  fileName: z
    .string()
    .min(1, { message: "File name is required" })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: "File name contains invalid characters",
    })
    .openapi({ example: "profile-photo.jpg" }),
  contentType: z
    .enum(ALLOWED_MIME_TYPES, {
      message: `Content type must be one of : ${ALLOWED_MIME_TYPES.join(", ")}`,
    })
    .openapi({ example: "image/jpeg" }),
  fileSize: z
    .number()
    .positive()
    .max(MAX_FILE_SIZE_BYTES, {
      message: `File size must not exceed ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MV`,
    })
    .openapi({ example: 148676 }),
});

export const confirmUploadSchema = z.object({
  blobName: z
    .string()
    .min(1, {
      message: "blobName is required",
    })
    .openapi({ example: "b3f1d2a4-....-jpg" }),
});

export type TRequestUploadUrl = z.infer<typeof requestUploadUrlSchema>;
export type TConfirmUpload = z.infer<typeof confirmUploadSchema>;

export { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES };
