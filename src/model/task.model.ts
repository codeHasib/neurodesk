import { Schema, model, models } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true, // Optimized for project-based filtering
    },
    workSpaceId: {
      type: String,
      required: true,
      index: true, // Optimized for workspace-wide views
    },
    ownerId: {
      type: String,
      required: true,
    },
    // The logic: Stores the userId of the team member assigned to this task
    assignedTo: {
      type: String,
      default: null, // Null means it's in the 'Unassigned' backlog
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true // Crucial for tracking when tasks were assigned/updated
  }
);

// Add a compound index for fast lookups of a specific user's tasks within a workspace
taskSchema.index({ workSpaceId: 1, assignedTo: 1 });

export const Task = models.Task || model("Task", taskSchema);