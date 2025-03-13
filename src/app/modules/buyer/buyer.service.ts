import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { UpdateBuyerPayload } from './buyer.interface';
import { Buyer } from './buyer.model';
import unlinkFile from '../../../shared/unlinkFile';

const updateBuyerToDB = async (id: string, payload: UpdateBuyerPayload) => {
  const isExistSeller = await Buyer.findOne({ _id: id });

  if (!isExistSeller) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Seller doesn't exist!");
  }

  // Handle images to delete
  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image);
    }
    // Remove deleted images from the existing image array
    isExistSeller.image = isExistSeller.image.filter(
      (img: string) => !payload.imagesToDelete!.includes(img)
    );
  }

  // Handle documents to delete
  if (payload.documentsToDelete && payload.documentsToDelete.length > 0) {
    for (let document of payload.documentsToDelete) {
      unlinkFile(document);
    }
    // Remove deleted documents from the existing document array
    isExistSeller.document = isExistSeller.document.filter(
      (doc: string) => !payload.documentsToDelete!.includes(doc)
    );
  }

  // Handle videos to delete
  if (payload.videosToDelete && payload.videosToDelete.length > 0) {
    for (let video of payload.videosToDelete) {
      unlinkFile(video);
    }
  }

  // Handle new image uploads
  const updatedImages = payload.image
    ? [...isExistSeller.image, ...payload.image]
    : isExistSeller.image;

  // Handle new document uploads (documentsToDelete filter is not needed again)
  const updatedDocuments = payload.document
    ? [...isExistSeller.document, ...payload.document]
    : isExistSeller.document;

  const updateData = {
    ...payload,
    image: updatedImages,
    document: updatedDocuments,
  };

  // Save the updated seller data
  const result = await Buyer.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  return result;
};

export const BuyerService = {
  updateBuyerToDB,
};
