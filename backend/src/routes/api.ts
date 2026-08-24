import express from "express";

import authRoutes from "../modules/authentication/auth-routes";
import categoryRoutes from "../modules/category/category-routes";
import uploadRoutes from "../modules/upload/upload.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/uploads", uploadRoutes);

export default router;
