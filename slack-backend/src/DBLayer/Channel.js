import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    ChannelName: {
      type: String,
      required: [true, "Channel name is required"],
      unique: true,
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

const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;
