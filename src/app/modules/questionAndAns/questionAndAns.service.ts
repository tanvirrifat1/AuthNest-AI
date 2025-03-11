import openai from '../../../shared/openAi';

const createChat = async (data: any) => {
  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: data.question }],
  });

  const aiResponse = result.choices[0].message?.content;

  return aiResponse;
};

export const QuestionAndAnsService = {
  createChat,
};
