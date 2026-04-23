import { Router } from "express";

import { authRouter } from "./auth";
import { workflowRouter } from "./workflows";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/workflows", workflowRouter);

export { apiRouter };

