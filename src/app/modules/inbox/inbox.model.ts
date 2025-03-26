import { model, Schema } from 'mongoose';
import { IInbox } from './inbox.interface';

const inboxSchema = new Schema<IInbox>({
  senderId: { type: Schema.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.ObjectId, ref: 'User', required: true },
  unreadCount: { type: Number, default: 0 },
});

export const Inbox = model<IInbox>('Inbox', inboxSchema);
