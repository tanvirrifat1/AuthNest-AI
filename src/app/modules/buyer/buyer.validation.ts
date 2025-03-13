import { z } from 'zod';

export const buyer = z.object({
  name: z.string().nonempty(),
  address: z.string().nonempty(),
  phone: z.string().nonempty(),
});

export const BuyerValiationZodSchema = {
  buyer,
};
