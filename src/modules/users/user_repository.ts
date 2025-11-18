import { ClientSession } from "mongoose";
import User, { IUser } from "./user_model";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

// * write operation
export const saveUser = (user: IUser, session?: ClientSession) => {
  return user.save({ session });
};
