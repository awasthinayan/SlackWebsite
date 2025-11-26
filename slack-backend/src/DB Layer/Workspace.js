import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceName: {
      type: String,
      required: [true, "Workspace name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: [true, "Member id is required"],
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    JoinCode: {
      type: String,
      required: [true, "Join code is required"],
      unique: true,
    },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  { timestamps: true },
);

const Workspace = mongoose.model("Workspace", WorkspaceSchema);

export default Workspace;
