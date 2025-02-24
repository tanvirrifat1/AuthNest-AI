import { Types } from 'mongoose';

export type ISELLER = {
  name: string;
  email: string;
  address: string;
  status: 'active' | 'deleted';
  image: string;
  phone: string;
  userId: Types.ObjectId;
};
