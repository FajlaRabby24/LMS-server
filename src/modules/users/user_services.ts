import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "./user_model";
import { findUserByEmail, saveUser } from "./user_repository";

// ------- register user ----------
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { name, email, password } = userData;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
        errors: ["An account with this email already exists"],
      };
    }

    // assign admin role for the first user
    const existingUserCount = await User.estimatedDocumentCount();
    const assignedRole: IUser["role"] =
      existingUserCount === 0 ? "admin" : "user";

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: assignedRole,
    });

    // ------- generate OTP ---------
    const activationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    newUser.activationCode = activationCode;
    newUser.activationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // TODO: send verification email

    // 1: 45
    await saveUser(newUser);
    return {
      success: true,
      message: "User registerd successfully",
      data: {
        message: "Please check your email to verify your account.",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Registration failed",
      errors: [error.message],
    };
  }
};
