import { Router } from "express";
import { z } from "zod";

import { AuthRequest, requireAuth } from "../middleware/auth";
import { WorkflowModel } from "../models/Workflow";
import { executeWorkflow } from "../services/execution-engine";
import { WorkflowDefinition } from "../types/workflow";

const workflowRouter = Router();

const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["trigger", "ai", "api", "state", "output"]),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()),
});

const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

const workflowSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(""),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
});

workflowRouter.use(requireAuth);

workflowRouter.get("/", async (req: AuthRequest, res) => {
  const workflows = await WorkflowModel.find({ userId: req.user!.id }).sort({ updatedAt: -1 });
  res.json(workflows);
});

workflowRouter.post("/", async (req: AuthRequest, res) => {
  try {
    const payload = workflowSchema.parse(req.body);
    const workflow = await WorkflowModel.create({
      ...payload,
      userId: req.user!.id,
    });

    res.status(201).json(workflow);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Could not save workflow",
    });
  }
});

workflowRouter.put("/:id", async (req: AuthRequest, res) => {
  try {
    const payload = workflowSchema.parse(req.body);
    const workflow = await WorkflowModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      payload,
      { new: true }
    );

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json(workflow);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Could not update workflow",
    });
  }
});

workflowRouter.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const workflow = await WorkflowModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    res.json({ message: "Workflow deleted" });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Could not delete workflow",
    });
  }
});

workflowRouter.post("/execute", async (req: AuthRequest, res) => {
  try {
    const payload = workflowSchema.extend({ name: z.string().default("Untitled") }).parse(req.body);
    const workflow: WorkflowDefinition = {
      nodes: payload.nodes,
      edges: payload.edges,
    };
    const result = await executeWorkflow(workflow);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Workflow execution failed",
    });
  }
});

export { workflowRouter };
