import { z } from 'zod';

export const seller = z.object({
  name: z.string().nonempty(),
  address: z.string().nonempty(),
  phone: z.string().nonempty(),
});

export const SellerValiationZodSchema = {
  seller,
};
