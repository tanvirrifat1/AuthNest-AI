import express from 'express';
import { QuestionAndAnsController } from './questionAndAns.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

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
