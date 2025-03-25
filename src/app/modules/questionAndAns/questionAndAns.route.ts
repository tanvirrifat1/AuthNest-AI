import express, { NextFunction, Request, Response } from 'express';
import { QuestionAndAnsController } from './questionAndAns.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { QuestionAndAnsValidation } from './questionAndAns.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// router.post(
//   '/create-chat',
//   fileUploadHandler,
//   auth(USER_ROLES.BUYER, USER_ROLES.SELLER),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = QuestionAndAnsValidation.createChatValidation.parse(
//       JSON.parse(req.body.data)
//     );
//     return QuestionAndAnsController.createChat(req, res, next);
//   }
// );

router.post(
  '/create-chat',
  auth(USER_ROLES.BUYER, USER_ROLES.SELLER),
  QuestionAndAnsController.createChat
);

router.get(
  '/get-question-and-ans/:roomId',
  auth(USER_ROLES.BUYER, USER_ROLES.SELLER),
  QuestionAndAnsController.getQuestionAndAns
);

export const QuestionAndAnsRoutes = router;
