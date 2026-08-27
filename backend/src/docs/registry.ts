import "../lib/zod-extend";
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
import {
  categoryQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from "../modules/category/category-validation";
import {
  createEventSchema,
  eventQuerySchema,
  updateEventSchema,
} from "../modules/event/event.validation";
import {
  idParamsSchema,
  eventIdParamSchema,
  slugParamSchema,
} from "../validations/common-validation";
import {
  createTicketSchema,
  ticketQuerySchema,
  updateTicketSchema,
} from "../modules/ticket/ticket.validation";
import {
  bannerQuerySchema,
  createBannerSchema,
  updateBannerSchema,
} from "../modules/banner/banner.validation";

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
    success: z.literal(false).openapi({ example: false }),
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
    data: z
      .string()
      .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
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

const paginationMetaSchema = z
  .object({
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 10 }),
    totalItems: z.number().openapi({ example: 25 }),
    totalPages: z.number().openapi({ example: 3 }),
    hasNextPage: z.boolean().openapi({ example: true }),
    hasPrevPage: z.boolean().openapi({ example: false }),
  })
  .openapi("PaginationMeta");

const categorySchema = z
  .object({
    _id: z.string().openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    name: z.string().openapi({ example: "Concert" }),
    description: z
      .string()
      .openapi({ example: "Events and live musical performances" }),
    icon: z.string().openapi({ example: "music" }),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .openapi("Category");

const categoryResponseSchema = (
  message: string,
  name: string,
  data: z.ZodType,
) =>
  z
    .object({
      success: z.literal(true).openapi({ example: true }),
      message: z.string().openapi({ example: message }),
      data,
    })
    .openapi(name);

const categoryListResponseSchema = z
  .object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().openapi({ example: "Success find all category" }),
    data: z.array(categorySchema),
    meta: paginationMetaSchema,
  })
  .openapi("CategoryListResponse");

const eventLocationResponseSchema = z
  .object({
    venueName: z.string().optional().openapi({ example: "Gelora Bung Karno" }),
    address: z.string().optional().openapi({ example: "Jakarta Pusat" }),
    province: z.object({ id: z.string(), name: z.string() }).optional(),
    regency: z.object({ id: z.string(), name: z.string() }).optional(),
    district: z.object({ id: z.string(), name: z.string() }).optional(),
    village: z.object({ id: z.string(), name: z.string() }).optional(),
    coordinates: z
      .object({
        lat: z.number().openapi({ example: -6.2088 }),
        lng: z.number().openapi({ example: 106.8456 }),
      })
      .optional(),
  })
  .openapi("EventLocation");

const eventSchema = z
  .object({
    _id: z.string().openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    name: z.string().openapi({ example: "Rock Fest 2026" }),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    description: z
      .string()
      .openapi({ example: "Events and live musical performances" }),
    banner: z
      .string()
      .url()
      .openapi({ example: "https://cdn.example.com/banner.jpg" }),
    category: z
      .union([z.string(), categorySchema])
      .openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    slug: z.string().openapi({ example: "rock-fest-2026" }),
    createdBy: z.union([z.string(), userSchema]),
    isFeatured: z.boolean().openapi({ example: false }),
    isOnline: z.boolean().openapi({ example: false }),
    isPublish: z.boolean().openapi({ example: true }),
    location: eventLocationResponseSchema.optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .openapi("Event");

const eventListResponseSchema = z
  .object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().openapi({ example: "Events retrieved successfully" }),
    data: z.array(eventSchema),
    meta: paginationMetaSchema,
  })
  .openapi("EventListResponse");

const ticketSchema = z
  .object({
    _id: z.string().openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    name: z.string().openapi({ example: "Early Bird - VIP Access" }),
    events: z
      .union([z.string(), eventSchema])
      .openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    price: z.number().openapi({ example: 150000 }),
    quantity: z.number().openapi({ example: 100 }),
    description: z
      .string()
      .openapi({ example: "Includes front-row seating and merchandise." }),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .openapi("Ticket");

const ticketListResponseSchema = z
  .object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().openapi({ example: "Ticket find all successfully" }),
    data: z.object({
      data: z.array(ticketSchema),
      meta: paginationMetaSchema,
    }),
  })
  .openapi("TicketListResponse");

const bannerSchema = z
  .object({
    _id: z.string().openapi({ example: "64f1a2b3c4d5e6f7g8h9i0j1" }),
    title: z.string().openapi({ example: "Summer Tech Music Festival 2026" }),
    image: z.string().openapi({
      example: "banners/38478785-eae1-41ad-a4df-184b1b4554e7.png",
    }),
    isShow: z.boolean().openapi({ example: true }),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .openapi("Banner");

const bannerListResponseSchema = z
  .object({
    success: z.literal(true).openapi({ example: true }),
    message: z.string().openapi({ example: "Banners retrieved successfully" }),
    data: z.array(bannerSchema),
    meta: paginationMetaSchema,
  })
  .openapi("BannerListResponse");

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

registry.registerPath({
  method: "post",
  path: "/categories",
  tags: ["Category"],
  summary: "Create a category",
  security: bearerSecurity,
  request: jsonBody(createCategorySchema),
  responses: {
    201: {
      description: "Category created successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success create a category",
            "CreateCategoryResponse",
            categorySchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
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
  path: "/categories",
  tags: ["Category"],
  summary: "Get all categories",
  request: {
    query: categoryQuerySchema,
  },
  responses: {
    200: {
      description: "Categories retrieved successfully",
      content: { "application/json": { schema: categoryListResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/categories/{id}",
  tags: ["Category"],
  summary: "Get one category",
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Category retrieved successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success find one category",
            "FindCategoryResponse",
            categorySchema,
          ),
        },
      },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/categories/{id}",
  tags: ["Category"],
  summary: "Update a category",
  security: bearerSecurity,
  request: {
    params: idParamsSchema,
    ...jsonBody(updateCategorySchema),
  },
  responses: {
    200: {
      description: "Category updated successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success update category",
            "UpdateCategoryResponse",
            categorySchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/categories/{id}",
  tags: ["Category"],
  summary: "Delete a category",
  security: bearerSecurity,
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Category deleted successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success remove category",
            "DeleteCategoryResponse",
            z.null(),
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
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
  path: "/events",
  tags: ["Event"],
  summary: "Create an event",
  security: bearerSecurity,
  request: jsonBody(createEventSchema),
  responses: {
    201: {
      description: "Event created successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Event created successfully",
            "CreateEventResponse",
            eventSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Selected category does not exists",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    409: {
      description:
        "An event with the exact same name and start date already exists",
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
  path: "/events",
  tags: ["Event"],
  summary: "Get all events",
  description:
    "Retrieve paginated events with optional text, category, featured, online, and publication-status filters. Boolean filters accept true or false.",
  request: {
    query: eventQuerySchema,
  },
  responses: {
    200: {
      description: "Events retrieved successfully",
      content: { "application/json": { schema: eventListResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/events/{id}",
  tags: ["Event"],
  summary: "Get one event",
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Event retrieved successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success find one event",
            "FindEventResponse",
            eventSchema,
          ),
        },
      },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/events/{slug}/slug",
  tags: ["Event"],
  summary: "Get one event by slug",
  request: { params: slugParamSchema },
  responses: {
    200: {
      description: "Event retrieved successfully by slug",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success find one event by slug",
            "FindEventBySlugResponse",
            eventSchema,
          ),
        },
      },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Event not found",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/events/{id}",
  tags: ["Event"],
  summary: "Update an event",
  security: bearerSecurity,
  request: {
    params: idParamsSchema,
    ...jsonBody(updateEventSchema),
  },
  responses: {
    200: {
      description: "Event updated successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success update event",
            "UpdateEventResponse",
            eventSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Event not found",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    409: {
      description:
        "Another event with the exact same name and start date already exists",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/events/{id}",
  tags: ["Event"],
  summary: "Delete an event",
  security: bearerSecurity,
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Event deleted successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success remove event ",
            "DeleteEventResponse",
            eventSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
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
  path: "/tickets",
  tags: ["Ticket"],
  summary: "Create a ticket tier",
  security: bearerSecurity,
  request: jsonBody(createTicketSchema),
  responses: {
    201: {
      description: "Ticket created successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Ticket created successfully",
            "CreateTicketResponse",
            ticketSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Selected event does not exists",
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
  path: "/tickets",
  tags: ["Ticket"],
  summary: "Get all tickets",
  request: { query: ticketQuerySchema },
  responses: {
    200: {
      description: "Tickets retrieved successfully",
      content: { "application/json": { schema: ticketListResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/tickets/{id}",
  tags: ["Ticket"],
  summary: "Get one ticket",
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Ticket retrieved successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Ticket retrieved successfully",
            "FindTicketResponse",
            ticketSchema,
          ),
        },
      },
    },
    404: {
      description: "Ticket not found",
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
  path: "/tickets/{eventId}/events",
  tags: ["Ticket"],
  summary: "Get tickets for an event",
  request: { params: eventIdParamSchema },
  responses: {
    200: {
      description: "Tickets retrieved successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Ticket retrieved successfully",
            "FindTicketsByEventResponse",
            z.array(ticketSchema),
          ),
        },
      },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/tickets/{id}",
  tags: ["Ticket"],
  summary: "Update a ticket",
  security: bearerSecurity,
  request: {
    params: idParamsSchema,
    ...jsonBody(updateTicketSchema),
  },
  responses: {
    200: {
      description: "Ticket updated successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Success update ticket",
            "UpdateTicketResponse",
            ticketSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Ticket not found",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/tickets/{id}",
  tags: ["Ticket"],
  summary: "Delete a ticket",
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Ticket deleted successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Ticket delete successfully",
            "DeleteTicketResponse",
            ticketSchema,
          ),
        },
      },
    },
    404: {
      description: "Ticket not found",
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
  path: "/banners",
  tags: ["Banner"],
  summary: "Create a banner",
  security: bearerSecurity,
  request: jsonBody(createBannerSchema),
  responses: {
    201: {
      description: "Banner created successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Banner created successfully",
            "CreateBannerResponse",
            bannerSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
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
  path: "/banners",
  tags: ["Banner"],
  summary: "Get all banners",
  request: { query: bannerQuerySchema },
  responses: {
    200: {
      description: "Banners retrieved successfully",
      content: { "application/json": { schema: bannerListResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/banners/{id}",
  tags: ["Banner"],
  summary: "Get one banner",
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Banner retrieved successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Banner retrieved successfully",
            "FindBannerResponse",
            bannerSchema,
          ),
        },
      },
    },
    404: {
      description: "Banner not found",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/banners/{id}",
  tags: ["Banner"],
  summary: "Update a banner",
  security: bearerSecurity,
  request: {
    params: idParamsSchema,
    ...jsonBody(updateBannerSchema),
  },
  responses: {
    200: {
      description: "Banner updated successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Banner updated successfully",
            "UpdateBannerResponse",
            bannerSchema,
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Banner not found",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    422: {
      description: "Validation failed",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/banners/{id}",
  tags: ["Banner"],
  summary: "Delete a banner",
  security: bearerSecurity,
  request: { params: idParamsSchema },
  responses: {
    200: {
      description: "Banner deleted successfully",
      content: {
        "application/json": {
          schema: categoryResponseSchema(
            "Banner deleted successfully",
            "DeleteBannerResponse",
            z.null(),
          ),
        },
      },
    },
    401: {
      description: "Unauthorized access",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    403: {
      description: "You do not have permission to access this resource",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    404: {
      description: "Banner not found",
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
      { name: "Category", description: "Category management endpoints" },
      { name: "Event", description: "Event management endpoints" },
      { name: "Ticket", description: "Ticket management endpoints" },
      { name: "Banner", description: "Banner management endpoints" },
    ],
  });
}
