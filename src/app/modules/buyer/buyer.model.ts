import { model, Schema } from 'mongoose';
import { IBUYER } from './buyer.interface';

const buyerSchema = new Schema<IBUYER>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    image: { type: String },
    phone: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Buyer = model<IBUYER>('Buyer', buyerSchema);
