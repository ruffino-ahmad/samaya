// src/config/error.config.ts
import { setConfig, AppError } from "ds-express-errors";
import { ZodError } from "zod";
import mongoose from "mongoose";

// Extend AppError biar punya property `details` yang type-safe
class ValidationAppError extends AppError {
  details: { field: string; message: string }[];

  constructor(
    message: string,
    statusCode: number,
    details: { field: string; message: string }[],
  ) {
    super(message, statusCode, true);
    this.details = details;
  }
}

export function setupErrorHandling() {
  setConfig({
    needMappers: ["zod", "mongoose"],
    devEnvironments: ["development", "local"],

    customMappers: [
      // Mapper untuk ZodError -> kasih detail per-field
      (err: any) => {
        if (err instanceof ZodError) {
          const details = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }));

          return new ValidationAppError("Validation failed", 422, details);
        }
      },

      // Mapper untuk Mongoose ValidationError -> kasih detail per-field
      (err: any) => {
        if (err instanceof mongoose.Error.ValidationError) {
          const details = Object.values(err.errors).map((e: any) => ({
            field: e.path,
            message: e.message,
          }));

          return new ValidationAppError("Validation failed", 422, details);
        }
      },
    ],

    formatError: (error: any, { req, isDev }) => {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const isOperational = error instanceof AppError && error.isOperational;

      const base: any = {
        code: statusCode,
        status: isOperational ? "fail" : "error",
        message: isDev
          ? error.message
          : isOperational
            ? error.message
            : "Something went wrong. Please try again later.",
      };

      // Cuma tambahin `data` kalau error-nya emang punya detail (Zod/Mongoose)
      if (error instanceof ValidationAppError) {
        base.data = error.details;
      }

      if (isDev) {
        base.debug = {
          method: req.method,
          url: req.originalUrl,
          stack: error.stack,
        };
      }

      return base;
    },
  });
}
