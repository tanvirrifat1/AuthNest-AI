import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { sendEmail } from '../../../helpers/sendMail';
import { Buyer } from '../buyer/buyer.model';
import { Seller } from '../seller/seller.model';
import { IUser } from '../user/user.interface';

const informUser = async (userId: string) => {
  const isSeller = await Buyer.findOne({ _id: userId });

  if (isSeller?.email) {
    await sendEmail(
      [isSeller.email, 'm.riyad3834@gmail.com'], // Array of recipients
      `Your Payment is Successfully Done`,
      `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <p>Dear ${isSeller.name},</p>
            <p><strong>Email:</strong> ${isSeller.email}</p>                    
          </div>
        `
    );
  } else {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Email is missing');
  }
};

export const sendMailService = {
  informUser,
};
