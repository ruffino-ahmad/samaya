import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" });

export const slugSchema = z
  .string()
  .trim()
  .min(2, { message: "Slug must be at least 2 charcters" })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must only contain lowercase letters, numbers, and hyphens",
  });

export const idParamsSchema = z.object({
  id: objectIdSchema.openapi({
    param: {
      name: "id",
      in: "path",
    },
    example: "64f1a2b3c4d5e6f7g8h9i0j1",
  }),
});

export const slugParamSchema = z.object({
  slug: slugSchema.openapi({
    param: {
      name: "slug",
      in: "path",
    },
    example: "rock-concert-jakarta",
  }),
});

export type IdParamInput = z.infer<typeof idParamsSchema>;
export type SlugParamInput = z.infer<typeof slugParamSchema>;
