import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { RoomController } from './room.controller';

const router = express.Router();

router.get(
  '/get-recent-chat-rooms',
  auth(USER_ROLES.BUYER, USER_ROLES.SELLER),
  RoomController.getRecentChatRooms
);

export const RoomRoutes = router;
