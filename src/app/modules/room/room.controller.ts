import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RoomService } from './room.service';

const getRecentChatRooms = catchAsync(async (req, res) => {
  const userId = req.user.roleBaseId;

  const result = await RoomService.getRecentChatRooms(req.query, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Chat rooms retrived successfully',
    data: result,
  });
});

export const RoomController = {
  getRecentChatRooms,
};
