import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.use("/api", apiRouter);

  return app;
}

