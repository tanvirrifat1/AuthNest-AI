import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IInbox } from './inbox.interface';
import { Inbox } from './inbox.model';

const createInbox = async (payload: IInbox): Promise<IInbox> => {
  const isUser = await User.findById(payload.receiverId);
  if (!isUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  let inbox = await Inbox.findOne({
    senderId: payload.senderId,
    receiverId: payload.receiverId,
  });

  if (!inbox) {
    inbox = await Inbox.create(payload);
  } else {
    inbox.unreadCount = inbox.unreadCount + 1;
    await inbox.save();
  }

  return inbox;
};

export const InboxService = {
  createInbox,
};
