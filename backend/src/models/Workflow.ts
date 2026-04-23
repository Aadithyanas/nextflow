import { Schema, model } from "mongoose";

const workflowNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const workflowEdgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
  },
  { _id: false }
);

export interface WorkflowDocument {
  name: string;
  description?: string;
  userId: string;
  nodes: unknown[];
  edges: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

const workflowSchema = new Schema<WorkflowDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    userId: { type: String, required: true, index: true },
    nodes: { type: [workflowNodeSchema], default: [] },
    edges: { type: [workflowEdgeSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const WorkflowModel = model<WorkflowDocument>("Workflow", workflowSchema);

