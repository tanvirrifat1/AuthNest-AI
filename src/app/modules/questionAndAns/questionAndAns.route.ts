import express from 'express';
import { QuestionAndAnsController } from './questionAndAns.controller';

const router = express.Router();

router.post('/create-chat', QuestionAndAnsController.createChat);

export const QuestionAndAnsRoutes = router;
