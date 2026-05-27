import { Schema, model, models } from "mongoose";

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  workSpaceId: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

export const Project = models.Project || model("Project", projectSchema);
