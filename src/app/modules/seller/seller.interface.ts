import { Types } from 'mongoose';

export type ISELLER = {
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

export type UpdateSellerPayload = Partial<ISELLER> & {
  documentsToDelete?: string[];
  imagesToDelete?: string[];
  videosToDelete?: string[];
};
