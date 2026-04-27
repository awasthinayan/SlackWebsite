import cloudinary from "../config/CloudinarySdk.js";
import {
  getDirectMessagesService,
  getMessagesService,
} from "../Services/messageService.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/serverConfig.js";

export const getMessagesController = async (req, res) => {
  try {
    const messages = await getMessagesService(
      { channelId: req.params.channelId },
      req.query.page || 1,
      req.query.limit || 20,
      req.user,
    );

    if (messages.error) {
      return res.status(messages.status || StatusCodes.BAD_REQUEST).json({
        success: false,
        message: messages.message,
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("User controller error:", error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

export const getDirectMessagesController = async (req, res) => {
  try {
    const messages = await getDirectMessagesService(
      {
        workspaceId: req.params.workspaceId,
        memberId: req.params.memberId,
      },
      req.query.page || 1,
      req.query.limit || 20,
      req.user,
    );

    if (messages.error) {
      return res.status(messages.status || StatusCodes.BAD_REQUEST).json({
        success: false,
        message: messages.message,
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Direct messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Direct message controller error:", error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};

export const getCloudinarySignatureController = async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("sha256")
      .update(`timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
      .digest("hex");

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        apiKey: CLOUDINARY_API_KEY,
        cloudName: CLOUDINARY_CLOUD_NAME,
        timestamp,
        signature,
      },
      message: "Signature generated successfully",
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
      data: null,
    });
  }
};
