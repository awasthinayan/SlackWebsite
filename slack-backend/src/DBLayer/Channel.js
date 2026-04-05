import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    ChannelName: {
      type: String,
      required: [true, "Channel name is required"],
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace id is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ChannelSchema.index({ workspaceId: 1, ChannelName: 1 }, { unique: true });

const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;
