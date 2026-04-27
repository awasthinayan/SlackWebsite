import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Message body is required"],
    },
    image: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      default: null,
    },
    conversationId: {
      type: String,
      default: null,
      index: true,
    },
    SenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Sender id is required"],
    },
    RecipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    WorkspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace id is required"],
    },
    isDirect: {
      type: Boolean,
      default: false,
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
