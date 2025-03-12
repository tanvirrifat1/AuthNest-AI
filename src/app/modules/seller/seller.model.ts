import { model, Schema } from 'mongoose';
import { ISELLER } from './seller.interface';

const sellerSchema = new Schema<ISELLER>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    image: [{ type: String }],
    video: [{ type: String }],
    document: [{ type: String }],
    phone: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Seller = model<ISELLER>('Seller', sellerSchema);
