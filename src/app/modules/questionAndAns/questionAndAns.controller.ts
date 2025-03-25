import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { QuestionAndAnsService } from './questionAndAns.service';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createChat = catchAsync(async (req, res) => {
  const user = req.user.roleBaseId;

  const value = {
    ...req.body,
    user,
  };

  const result = await QuestionAndAnsService.createChat(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Chat created successfully',
    data: result,
  });
});

const getQuestionAndAns = catchAsync(async (req, res) => {
  const result = await QuestionAndAnsService.getQuestionAndAns(
    req.query,
    req.params.roomId
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Question and answer retrived successfully',
    data: result,
  });
});

export const QuestionAndAnsController = {
  createChat,
  getQuestionAndAns,
};
