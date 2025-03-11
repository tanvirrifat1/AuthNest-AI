import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Seller } from './seller.model';
import { UpdateSellerPayload } from './seller.interface';
import unlinkFile from '../../../shared/unlinkFile';

const updateSellerToDB = async (id: string, payload: UpdateSellerPayload) => {
  const isExistSeller = await Seller.findOne({ _id: id });

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
  const result = await Seller.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  return result;
};

const getAllRequests = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Seller.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Seller.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const SellerService = {
  updateSellerToDB,
  getAllRequests,
};
