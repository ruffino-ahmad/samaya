import express from "express";
import mongoose from "mongoose";

import router from "./routes/api";

import {
  setConfig,
  errorHandler,
  initGlobalHandlers,
  gracefulHttpClose,
  AppError,
} from "ds-express-errors";

import connectToDatabase from "./utils/database";
import { PORT } from "./utils/env.js";

async function startServer() {
  try {
    // SET UP DATABASE
    const result = await connectToDatabase();
    console.log("Database status:", result);

    // SET UP ERROR HANDLING
    setConfig({
      needMappers: ["zod", "mongoose"],
      devEnvironments: ["development", "local"],

      formatError: (error, { req, isDev }) => ({
        status:
          error instanceof AppError && error.isOperational ? "fail" : "error",
        message: error.message,
        ...(isDev
          ? {
              method: req.method,
              url: req.originalUrl,
              stack: error.stack,
            }
          : {}),
      }),
    });

    // SET UP EXPRESS APP
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "success",
        message: "Server is healthy",
      });
    });

    app.use("/api", router);

    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    initGlobalHandlers({
      closeServer: gracefulHttpClose(server),

      onShutdown: async (signal) => {
        console.log(`Received ${signal}. Shutting down gracefully...`);
        await mongoose.disconnect();
      },

      onCrash: async (error, signal) => {
        console.error("Application crashed: ", error);
      },

      maxTimeout: 10000, // 10 seconds
    });
  } catch (error) {
    console.error("Start Server failed:", error);
    process.exit(1);
  }
}

startServer();
