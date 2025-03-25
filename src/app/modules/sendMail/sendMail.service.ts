import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { sendEmail } from '../../../helpers/sendMail';
import { Buyer } from '../buyer/buyer.model';
import { Seller } from '../seller/seller.model';
import { IUser } from '../user/user.interface';

const informUser = async (userId: string) => {
  try {
    const buyer = await Buyer.findOne({ _id: userId });

    if (!buyer?.email) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Email is missing');
    }

    const buyerEmail = buyer.email;
    const buyerName = buyer.name;

    // Prepare email data for the buyer
    const buyerEmailData = {
      email: buyerEmail,
      subject: 'Your Payment is Successfully Done',
      text: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Dear ${buyerName},</p>
          <p><strong>Email:</strong> ${buyerEmail}</p>
        </div>
      `,
    };

    // Prepare email data for the admin notification
    const adminEmailData = {
      email: 'rifatmiah373@gmail.com',
      subject: 'Payment Notification',
      text: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>${buyerName} has successfully made a payment.</p>
          <p><strong>User Email:</strong> ${buyerEmail}</p>
        </div>
      `,
    };

    // Send emails concurrently
    await Promise.all([
      sendEmail(
        buyerEmailData.email,
        buyerEmailData.subject,
        buyerEmailData.text
      ),
      sendEmail(
        adminEmailData.email,
        adminEmailData.subject,
        adminEmailData.text
      ),
    ]);

    return 'Email sent successfully';
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      (error as Error).message || 'Error sending email'
    );
  }
};

export const sendMailService = {
  informUser,
};
