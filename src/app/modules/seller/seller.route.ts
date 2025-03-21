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
  (req, res, next) => {
    const { imagesToDelete, documentsToDelete, videosToDelete, data } =
      req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return SellerController.updateController(req, res, next);
    }
    if (!data && documentsToDelete) {
      req.body = { documentsToDelete };
      return SellerController.updateController(req, res, next);
    }
    if (!data && videosToDelete) {
      req.body = { videosToDelete };
      return SellerController.updateController(req, res, next);
    }

    if (data) {
      const parsedData = SellerValiationZodSchema.seller.parse(
        JSON.parse(data)
      );

      req.body = { ...parsedData, imagesToDelete, documentsToDelete };
    }

    return SellerController.updateController(req, res, next);
  }
);

export const SellerRoute = router;
