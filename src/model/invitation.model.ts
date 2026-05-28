import mongoose, { Schema, model, models } from "mongoose";

const invitationSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    inviterId: { type: String, required: true }, // The Admin who invited
    email: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Invitation =
  models.Invitation || model("Invitation", invitationSchema);
