import { Types } from 'mongoose';

export type IBUYER = {
  name: string;
  email: string;
  address: string;
  status: 'active' | 'deleted';
  image: string[];
  document: string[];
  video: string[];
  phone: string;
  userId: Types.ObjectId;
};

export type UpdateBuyerPayload = Partial<IBUYER> & {
  documentsToDelete?: string[];
  imagesToDelete?: string[];
  videosToDelete?: string[];
};
