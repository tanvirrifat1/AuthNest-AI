import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SellerService } from './seller.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const updateController = catchAsync(async (req, res) => {
  const id = req.user.roleBaseId;

  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');
  let document = getFilePathMultiple(req.files, 'doc', 'doc');
  let media = getFilePathMultiple(req.files, 'media', 'media');

  if (image && image.length > 0) {
    value.image = image;
  }

  if (document && document.length > 0) {
    value.document = document;
  }

  if (media && media.length > 0) {
    value.video = media;
  }

  const result = await SellerService.updateSellerToDB(id, value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data updated successfully',
    data: result,
  });
});

export const SellerController = {
  updateController,
};
