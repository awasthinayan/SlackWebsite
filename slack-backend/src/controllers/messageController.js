import { StatusCodes } from 'http-status-codes';
import { getMessagesService } from '../Services/messageService.js';

export const getMessagesController = async (req, res) => {
  try {
    const messages = await getMessagesService(
      {
        channelId: req.params.channelId
      },
      req.query.page || 1,
      req.query.limit || 20,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json({
        error: false,
        data: messages,
        message: 'Messages fetched successfully',
        status: StatusCodes.OK,
      })
  } catch (error) {
    console.log('User controller error', error);
    if (error.statusCode) {
      return res.status(StatusCodestatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        data: { message: error.message },
      });
      }
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: true,
        data: { message: 'Server error' },
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })
  }