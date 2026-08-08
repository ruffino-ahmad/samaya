import type { Express } from "express";
import { apiReference } from "@scalar/express-api-reference";
import { generateOpenApiDocument } from "./registry.js";

export default function docs(app: Express) {
  app.use(
    "/api-docs",
    apiReference({
      spec: {
        content: generateOpenApiDocument(),
      },
      theme: "purple",
    }),
  );
}
