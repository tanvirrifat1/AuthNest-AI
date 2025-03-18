import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { sendMailService } from './sendMail.service';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';

const informUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.roleBaseId;

  const result = await sendMailService.informUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User informed successfully',
    data: result,
  });
});

export const sendMailController = {
  informUser,
};
