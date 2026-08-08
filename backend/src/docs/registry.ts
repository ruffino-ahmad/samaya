// docs/registry.ts
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  registerValidateSchema,
  loginValidateSchema,
  registerResponseSchema,
  loginResponseSchema,
  errorResponseSchema,
} from "../validations/auth-validation";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Register New User",
  request: {
    body: {
      content: { "application/json": { schema: registerValidateSchema } },
    },
  },
  responses: {
    201: {
      description: "Register berhasil",
      content: { "application/json": { schema: registerResponseSchema } },
    },
    400: {
      description: "Validasi gagal (misal password tidak cocok)",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Login user",
  request: {
    body: {
      content: { "application/json": { schema: loginValidateSchema } },
    },
  },
  responses: {
    200: {
      description: "Login berhasil",
      content: { "application/json": { schema: loginResponseSchema } },
    },
    401: {
      description: "Identifier atau password salah",
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
  });
}
