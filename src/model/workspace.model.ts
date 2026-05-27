import mongoose, { Schema, model, models } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    members: [
      {
        userId: String,
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Workspace =
  models.Workspace || model("Workspace", workspaceSchema);
