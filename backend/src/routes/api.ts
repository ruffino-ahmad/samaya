import express from "express";

import authRoutes from "../modules/authentication/auth-routes";
import categoryRoutes from "../modules/category/category-routes";
import eventRoutes from "../modules/event/event-routes";
import ticketRoutes from "../modules/ticket/ticket.routes";
import uploadRoutes from "../modules/upload/upload.routes";
import regionRoutes from "../modules/region/region-routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);
router.use("/uploads", uploadRoutes);
router.use("/regions", regionRoutes);

export default router;
