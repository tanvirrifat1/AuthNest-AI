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

export const QuestionAndAnsRoutes = router;
