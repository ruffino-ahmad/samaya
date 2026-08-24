import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  activationCodeSchema,
  loginValidateSchema,
  registerValidateSchema,
} from "../modules/authentication/auth-validation";
import {
  confirmUploadSchema,
  requestUploadUrlSchema,
} from "../modules/upload/upload.validation";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const errorDetailSchema = z.object({
  field: z.string().openapi({ example: "email" }),
  message: z.string().openapi({ example: "Invalid email address" }),
});

const errorResponseSchema = z
  .object({
    code: z.number().openapi({ example: 422 }),
    status: z.enum(["fail", "error"]).openapi({ example: "fail" }),
    message: z.string().openapi({ example: "Validation failed" }),
    data: z.array(errorDetailSchema).optional(),
  })
  .openapi("ErrorResponse");

const userSchema = z
  .object({
    _id: z.string().openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    fullname: z.string().openapi({ example: "Ruffino Ahmad Noor" }),
    username: z.string().openapi({ example: "fino" }),
    email: z.string().email().openapi({ example: "fino@example.com" }),
    role: z.string().openapi({ example: "member" }),
    profilePicture: z.string().openapi({ example: "" }),
    isActive: z.boolean().openapi({ example: false }),
  })
  .openapi("User");

const registerResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Register validation successful" }),
    data: userSchema,
  })
  .openapi("RegisterResponse");

const loginResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Login validation successful" }),
    data: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  })
  .openapi("LoginResponse");

const profileResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Get User Profile successful" }),
    data: userSchema,
  })
  .openapi("ProfileResponse");

const activationResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Account activation successful" }),
    data: userSchema,
  })
  .openapi("ActivationResponse");

const requestUploadUrlResponseSchema = z
  .object({
    uploadUrl: z.string().url().openapi({
      example: "https://storage.blob.core.windows.net/uploads/file.jpg?sv=...",
    }),
    blobName: z.string().openapi({
      example: "b3f1d2a4-1234-4567-8901-profile-photo.jpg",
    }),
    expiresAt: z.string().datetime().openapi({
      example: "2026-08-24T10:00:00.000Z",
    }),
  })
  .openapi("RequestUploadUrlResponse");

const confirmUploadResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Upload confirmed" }),
    blobName: z.string().openapi({
      example: "b3f1d2a4-1234-4567-8901-profile-photo.jpg",
    }),
  })
  .openapi("ConfirmUploadResponse");

const bearerSecurity = [{ bearerAuth: [] }];
const jsonBody = (schema: z.ZodType) => ({
  body: {
    content: {
      "application/json": { schema },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Authentication"],
  summary: "Register new user",
  request: jsonBody(registerValidateSchema),
  responses: {
    200: {
      description: "Registration successful",
      content: { "application/json": { schema: registerResponseSchema } },
    },
    409: {
      description: "Email already exists",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Authentication"],
  summary: "Login user",
  request: jsonBody(loginValidateSchema),
  responses: {
    200: {
      description: "Login successful",
      content: { "application/json": { schema: loginResponseSchema } },
    },
    403: {
      description: "Invalid email/username or password",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Authentication"],
  summary: "Get current user profile",
  security: bearerSecurity,
  responses: {
    200: {
      description: "Profile retrieved successfully",
      content: { "application/json": { schema: profileResponseSchema } },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/activation",
  tags: ["Authentication"],
  summary: "Activate user account",
  request: jsonBody(activationCodeSchema),
  responses: {
    200: {
      description: "Account activation successful",
      content: { "application/json": { schema: activationResponseSchema } },
    },
    400: {
      description: "Invalid or expired activation code",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/uploads/request-url",
  tags: ["Upload"],
  summary: "Generate a temporary Blob upload URL",
  security: bearerSecurity,
  request: jsonBody(requestUploadUrlSchema),
  responses: {
    200: {
      description: "Upload URL generated successfully",
      content: {
        "application/json": { schema: requestUploadUrlResponseSchema },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/uploads/confirm",
  tags: ["Upload"],
  summary: "Confirm and validate an uploaded Blob",
  security: bearerSecurity,
  request: jsonBody(confirmUploadSchema),
  responses: {
    200: {
      description: "Upload confirmed",
      content: { "application/json": { schema: confirmUploadResponseSchema } },
    },
    400: {
      description: "Uploaded file is invalid or was not found",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Samaya API Documentation",
      description: "API documentation for Samaya",
    },
    servers: [
      { url: "http://localhost:3000/api", description: "Local server" },
      { url: "https://api.samaya.com/api", description: "Production server" },
    ],
    tags: [
      { name: "Authentication", description: "User authentication endpoints" },
      { name: "Upload", description: "Azure Blob upload endpoints" },
    ],
  });
}
