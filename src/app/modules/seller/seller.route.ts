import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SellerController } from './seller.controller';
import { SellerValiationZodSchema } from './seller.validation';

const router = express.Router();

router.patch(
  '/update-profile',
  auth(USER_ROLES.SELLER),
  fileUploadHandler,
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return SellerController.updateController(req, res, next);
    }

    if (data) {
      const parsedData = SellerValiationZodSchema.seller.parse(
        JSON.parse(data)
      );

      req.body = { ...parsedData, imagesToDelete };
    }

    return SellerController.updateController(req, res, next);
  }
);

export const SellerRoute = router;
