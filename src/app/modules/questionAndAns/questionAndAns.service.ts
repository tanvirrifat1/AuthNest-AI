import { Room } from './../room/room.model';
import openai from '../../../shared/openAi';
import { IQuestionAndAns } from './questionAndAns.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import { QuestionAndAns } from './questionAndAns.model';

// const createChat = async (payload: IQuestionAndAns) => {
//   // Step 1: Check if the question is business-related
//   const checkResult = await openai.chat.completions.create({
//     model: 'gpt-4',
//     messages: [
//       {
//         role: 'system',
//         content:
//           'Determine if the user\'s question is related to business. Respond only with "yes" or "no".',
//       },
//       { role: 'user', content: payload.question },
//     ],
//   });

//   const isBusinessRelated = checkResult.choices[0].message?.content
//     ?.trim()
//     .toLowerCase();

//   if (isBusinessRelated !== 'yes') {
//     return 'I only answer business-related questions.';
//   }

//   // Step 2: Generate a business-related response
//   const result = await openai.chat.completions.create({
//     model: 'gpt-4',
//     messages: [
//       {
//         role: 'system',
//         content:
//           'You are an AI expert in business strategy. Answer business-related questions only.',
//       },
//       { role: 'user', content: payload.question },
//     ],
//   });

//   let roomId;
//   let room;

//   if (payload.room) {
//     room = await Room.findOne({ roomName: payload.room });

//     if (room) {
//       roomId = room.roomName;
//     } else {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
//     }
//   } else if (!payload.createRoom) {
//     room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });
//     if (room) {
//       roomId = room.roomName;
//     }
//   }

//   if (!room || payload.createRoom) {
//     const formattedDate = moment().format('HH:mm:ss');
//     room = await Room.create({
//       user: payload.user,
//       roomName: payload.question + ' ' + formattedDate,
//     });
//   }

//   const answer = result.choices[0].message?.content;

//   const value = {
//     question: payload.question,
//     answer: answer,
//     room: room._id,
//     user: payload.user,
//     createRoom: payload.createRoom,
//   };

//   const res = await QuestionAndAns.create(value);
//   return res;
// };

const createChat = async (payload: IQuestionAndAns) => {
  // Step 1: Check if the question is business-related
  const checkResult = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'Determine if the user\'s question is related to business. Respond only with "yes" or "no".',
      },
      { role: 'user', content: payload.question },
    ],
  });

  const isBusinessRelated = checkResult.choices[0].message?.content
    ?.trim()
    .toLowerCase();

  // if (isBusinessRelated !== 'yes') {
  //   return 'I only answer business-related questions.';
  // }

  // Step 2: Determine the room to use or create a new one
  let roomId;
  let room;

  if (payload.room) {
    room = await Room.findOne({ roomName: payload.room });
    if (room) {
      roomId = room.roomName;
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  } else if (!payload.createRoom) {
    room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });
    if (room) {
      roomId = room.roomName;
    }
  }

  if (!room || payload.createRoom) {
    const formattedDate = moment().format('HH:mm:ss');
    room = await Room.create({
      user: payload.user,
      roomName: payload.question + ' ' + formattedDate,
    });
  }

  // Step 3: Fetch previous chat history from the room
  const previousChats = await QuestionAndAns.find({ room: room._id })
    .sort({ createdAt: 1 }) // Sort by creation time to maintain order
    .select('question answer');

  // Step 4: Prepare messages with previous chat context
  const messages = [
    {
      role: 'system',
      content:
        'You are an AI expert in business strategy. Answer business-related questions based on the provided chat history and the current question.',
    },
    // Add previous chat history
    ...previousChats
      .map(chat => [
        { role: 'user', content: chat.question },
        { role: 'assistant', content: chat.answer },
      ])
      .flat(),
    // Add the current question
    { role: 'user', content: payload.question },
  ];

  // Step 5: Generate a response with context
  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages as any,
  });

  const answer = result.choices[0].message?.content;

  // Step 6: Save the new question and answer
  const value = {
    question: payload.question,
    answer: answer,
    room: room._id,
    user: payload.user,
    createRoom: payload.createRoom,
  };

  const res = await QuestionAndAns.create(value);
  return res;
};

const getQuestionAndAns = async (
  query: Record<string, unknown>,
  roomId: string
) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ room: roomId });

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

  const result = await QuestionAndAns.find(whereConditions)
    .populate({
      path: 'room',
      select: 'roomName',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await QuestionAndAns.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const QuestionAndAnsService = {
  createChat,
  getQuestionAndAns,
};
