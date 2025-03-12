import { z } from 'zod';

const createChatValidation = z.object({
  question: z.string().optional(),
  createRoom: z.boolean().optional(),
  room: z.string().optional(),
});

export const QuestionAndAnsValidation = {
  createChatValidation,
};
