import {
  createChannelService,
  deleteChannelService,
  getAllChannelService,
  getChannelByIdService,
  updateChannelService,
} from "../Services/channelService.js";
import { StatusCodes } from "http-status-codes";

export const createChannelController = async (req, res) => {
  try {
    const result = await createChannelService(
      req.body.channelName,
      req.body.workspaceId,
      req.user?._id,
    );

    if (result.error) {
      return res.status(result.status || StatusCodes.BAD_REQUEST).json({
        message: result.message,
        status: false,
      });
    }
    res.status(result.status || StatusCodes.CREATED).json({
      message: result.message,
      status: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: false,
    });
  }
};

export const getAllChannelController = async (req, res) => {
  try {
    const response = await getAllChannelService();
    if (response.error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: response.message,
        status: false,
      });
    }
    res.status(StatusCodes.OK).json({
      message: "All channel fetched successfully",
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: false,
    });
  }
};

export const getChannelByIdController = async (req, res) => {
  try {
    const result = await getChannelByIdService(req.params.channelId);

    if (result.error) {
      return res.status(result.status || StatusCodes.NOT_FOUND).json({
        message: result.message,
        status: false,
        data: result.data,
      });
    }

    return res.status(result.status || StatusCodes.OK).json({
      message: result.message,
      status: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: false,
    });
  }
};

export const updateChannelController = async (req, res) => {
  try {
    const result = await updateChannelService(
      req.params.channelId,
      req.params.workspaceId,
      req.body.ChannelName,
      req.user?._id,
    );

    if (result.error) {
      return res.status(result.status || StatusCodes.NOT_FOUND).json({
        message: result.message,
        status: false,
        data: result.data,
      });
    }

    return res.status(result.status || StatusCodes.OK).json({
      message: result.message,
      status: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: false,
    });
  }
};

export const deleteChannelController = async (req, res) => {
  try {
    const result = await deleteChannelService(
      req.params.channelId,
      req.user?._id,
    );

    if (result.error) {
      return res.status(result.status || StatusCodes.NOT_FOUND).json({
        message: result.message,
        status: false,
        data: result.data,
      });
    }

    return res.status(result.status || StatusCodes.OK).json({
      message: result.message,
      status: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: false,
    });
  }
};
