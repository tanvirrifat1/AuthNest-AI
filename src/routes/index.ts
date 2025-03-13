import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';
import { SellerRoute } from '../app/modules/seller/seller.route';
import { QuestionAndAnsRoutes } from '../app/modules/questionAndAns/questionAndAns.route';
import { RoomRoutes } from '../app/modules/room/room.route';
import { BuyerRoute } from '../app/modules/buyer/buyer.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/seller', route: SellerRoute },
  { path: '/buyer', route: BuyerRoute },
  { path: '/question', route: QuestionAndAnsRoutes },
  { path: '/room', route: RoomRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
