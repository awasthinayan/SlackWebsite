import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Message body is required"],
    },
    image: {
      type: String,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: [true, "Channel id is required"],
    },
    SenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Sender id is required"],
    },
    WorkspaceId: {
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
  { timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
