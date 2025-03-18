import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { sendMailController } from './sendMail.controller';

const router = express.Router();

router.post(
  '/send-mail',
  auth(USER_ROLES.BUYER, USER_ROLES.SELLER),
  sendMailController.informUser
);

export const sendMailRoutes = router;
