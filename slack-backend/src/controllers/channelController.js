import {
  createChannelService,
  getAllChannelService,
} from "../Services/channelService.js";
import { StatusCodes } from "http-status-codes";

export const createChannelController = async (req, res) => {
  try {
    const result = await createChannelService(
      req.body.channelName,
      req.body.workspaceId,
      req.user?._id
    );
    console.log(result);

    if (result.error) {
      console.log(result.message);
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
    console.log("result in controller", response);
    if (response.error) {
      console.log(response.message);
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
