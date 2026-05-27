import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  workSpaceId: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export const Task = models.Task || model("Task", taskSchema);
