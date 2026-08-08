import dotenv from "dotenv";
import e from "express";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "production";
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const ACS_CONNECTION_STRING = process.env.ACS_CONNECTION_STRING || "";
export const ACS_SENDER_ADDRESS = process.env.ACS_SENDER_ADDRESS || "";
export const QUEUE_CONNECTION_STRING =
  process.env.QUEUE_CONNECTION_STRING || "";
