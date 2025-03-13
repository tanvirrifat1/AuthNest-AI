import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BuyerController } from './buyer.controller';
import { BuyerValiationZodSchema } from './buyer.validation';

const router = express.Router();

router.patch(
  '/update-profile',
  auth(USER_ROLES.BUYER),
  fileUploadHandler,
  (req, res, next) => {
    const { imagesToDelete, documentsToDelete, videosToDelete, data } =
      req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return BuyerController.updateController(req, res, next);
    }
    if (!data && documentsToDelete) {
      req.body = { documentsToDelete };
      return BuyerController.updateController(req, res, next);
    }
    if (!data && videosToDelete) {
      req.body = { videosToDelete };
      return BuyerController.updateController(req, res, next);
    }

    if (data) {
      const parsedData = BuyerValiationZodSchema.buyer.parse(JSON.parse(data));

      req.body = { ...parsedData, imagesToDelete, documentsToDelete };
    }

    return BuyerController.updateController(req, res, next);
  }
);

export const BuyerRoute = router;
