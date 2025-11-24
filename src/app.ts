import userRoutes from "./user/user.routes";
import express from "express";
import routeNotFound from "./utils/fallback";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const SERVER_VERSION = process.env.SERVER_VERSION;

export default function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(SERVER_VERSION + "users", userRoutes);
  app.use(routeNotFound);
  return app;
}
