import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { QuestionAndAnsService } from './questionAndAns.service';

const createChat = catchAsync(async (req, res) => {
  const user = req.user.roleBaseId;

  console.log(user, 'userId');

  const value = {
    ...req.body,
    user,
  };

  const result = await QuestionAndAnsService.createChat(value);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Chat created successfully',
    data: result,
  });
});

export const QuestionAndAnsController = {
  createChat,
};
