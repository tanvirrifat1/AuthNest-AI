import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Seller } from './seller.model';
import { UpdateSellerPayload } from './seller.interface';
import unlinkFile from '../../../shared/unlinkFile';

const updateSellerToDB = async (id: string, payload: UpdateSellerPayload) => {
  const isExistSeller = await Seller.findOne({ _id: id });

  if (!isExistSeller) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Influencer doesn't exist!");
  }

  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image);
    }
    // Remove deleted images from the existing image array
    isExistSeller.image = isExistSeller.image.filter(
      (img: string) => !payload.imagesToDelete!.includes(img)
    );
  }

  const updatedImages = payload.image
    ? [...isExistSeller.image, ...payload.image]
    : isExistSeller.image;

  const updateData = {
    ...payload,
    image: updatedImages,
  };

  // Step 4: Save the updated influencer data
  const result = await Seller.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  return result;
};

export const SellerService = {
  updateSellerToDB,
};
