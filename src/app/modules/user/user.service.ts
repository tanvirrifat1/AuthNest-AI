import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder, startSession } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import unlinkFile from '../../../shared/unlinkFile';
import { IBUYER } from '../buyer/buyer.interface';
import { Buyer } from '../buyer/buyer.model';
import { Seller } from '../seller/seller.model';

const createBuyerToDB = async (payload: Partial<IUser & IBUYER>) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Validate required fields
    if (!payload.email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide email');
    }
    if (!payload.phone) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please provide phone number'
      );
    }

    const isEmail = await User.findOne({ email: payload.email });
    if (isEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists');
    }

    // Create user first
    const userPayload = {
      email: payload.email,
      role: USER_ROLES.BUYER,
      password: payload.password,
    };

    const [user] = await User.create([userPayload], { session });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Create client and associate with user
    const buyerPayload = {
      ...payload,
      userId: user._id,
    };

    const [buyer] = await Buyer.create([buyerPayload], { session });
    if (!buyer) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create client');
    }

    // Update user with client reference
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { buyerId: buyer._id } },
      { session, new: true }
    );
    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
    }

    // Generate OTP
    const otp = generateOTP();
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000), // OTP valid for 3 minutes
    };

    // Send email
    const emailValues: any = {
      name: payload.name,
      otp,
      email: payload.email,
    };
    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    // Update user with authentication details
    const updatedAuthenticationUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { authentication } },
      { session, new: true }
    );

    if (!updatedAuthenticationUser) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found for authentication update'
      );
    }

    // Commit transaction
    await session.commitTransaction();

    return updatedAuthenticationUser;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
const createSellerToDB = async (payload: Partial<IUser & IBUYER>) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Validate required fields
    if (!payload.email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide email');
    }
    if (!payload.phone) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please provide phone number'
      );
    }

    const isEmail = await User.findOne({ email: payload.email });
    if (isEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists');
    }

    // Create user first
    const userPayload = {
      email: payload.email,
      role: USER_ROLES.SELLER,
      password: payload.password,
    };

    const [user] = await User.create([userPayload], { session });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Create client and associate with user
    const sellerPayload = {
      ...payload,
      userId: user._id,
    };

    const [seller] = await Seller.create([sellerPayload], { session });
    if (!seller) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create client');
    }

    // Update user with client reference
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { sellerId: seller._id } },
      { session, new: true }
    );
    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
    }

    // Generate OTP
    const otp = generateOTP();
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000), // OTP valid for 3 minutes
    };

    // Send email
    const emailValues: any = {
      name: payload.name,
      otp,
      email: payload.email,
    };
    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    // Update user with authentication details
    const updatedAuthenticationUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { authentication } },
      { session, new: true }
    );

    if (!updatedAuthenticationUser) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'User not found for authentication update'
      );
    }

    // Commit transaction
    await session.commitTransaction();

    return updatedAuthenticationUser;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;

  // Search conditions
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [{ fullName: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    conditions.push({ $and: filterConditions });
  }

  conditions.push({ role: USER_ROLES.BUYER });

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  // Sorting setup
  const sortOrder = order === 'desc' ? -1 : 1;
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  // Query the database
  const [users, total] = await Promise.all([
    User.find(whereConditions)
      .sort(sortCondition)
      .skip(skip)
      .limit(pageSize)
      .lean<IUser[]>(), // Assert type
    User.countDocuments(whereConditions),
  ]);

  // Format the `updatedAt` field
  const formattedUsers = users?.map(user => ({
    ...user,
    updatedAt: user.updatedAt
      ? new Date(user.updatedAt).toISOString().split('T')[0]
      : null,
  }));

  // Meta information for pagination
  return {
    result: formattedUsers,
    meta: {
      total,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
    },
  };
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Delete old images if new images are provided
  if (payload.image && isExistUser.image) {
    if (Array.isArray(isExistUser.image)) {
      isExistUser.image.forEach((img: string) => unlinkFile(img));
    } else {
      unlinkFile(isExistUser.image as string);
    }
  }

  // if (payload.document && isExistUser.document) {
  //   if (Array.isArray(isExistUser.document)) {
  //     isExistUser.document.forEach((doc: string) => unlinkFile(doc));
  //   } else {
  //     unlinkFile(isExistUser.document as string);
  //   }
  // }

  // Delete old video if a new video is provided
  if (payload.video && isExistUser.video) {
    unlinkFile(isExistUser.video as string);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

export const UserService = {
  createBuyerToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsers,
  getSingleUser,
  createSellerToDB,
};
