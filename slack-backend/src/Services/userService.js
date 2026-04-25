import bcrypt from "bcrypt";
import crypto from "crypto";

import { emailVerificationMailObject } from "../common/mailObject.js";
import { addEmailtoMailQueue } from "../Producer/mailQueueProducer.js";
import {
  createUser,
  getAllUsers,
  getuserbyEmail,
  getuserbyId,
  saveEmailVerificationToken,
  saveOTP,
  updateUser,
  updateUserPassword,
  verifyEmailToken,
  verifyOTP,
} from "../RepoLayer/userRepo.js";
import { generateToken } from "../utils/jwt.js";
import { sendOtpViaBrevo } from "../utils/sendOtpViaBrevo.js";

export const registerUserService = async (userData) => {
  try {
    const { email, password, username } = userData;

    if (!email || !password || !username) {
      return { error: "Please fill all the fields" };
    }

    const existingUser = await getuserbyEmail(email);
    if (existingUser) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username,
      password: hashedPassword,
      email,
      isVerified: false,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await saveEmailVerificationToken(email, verificationToken, expires);

    const rawFrontendUrl = process.env.FRONTEND_URL;
    const frontendUrl =
      rawFrontendUrl &&
      rawFrontendUrl.trim() &&
      rawFrontendUrl.trim().toLowerCase() !== "undefined"
        ? rawFrontendUrl.trim()
        : "http://localhost:5173";

    const verificationLink = `${frontendUrl}/verify-email?email=${encodeURIComponent(
      email,
    )}&token=${verificationToken}`;

    const mailData = emailVerificationMailObject({
      username,
      verificationLink,
    });

    await addEmailtoMailQueue({
      ...mailData,
      to: email,
    });

    return {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      message: "User created successfully. Please verify your email.",
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const loginUserService = async ({ email, password }) => {
  try {
    const user = await getuserbyEmail(email);
    if (!user) throw new Error("User not found");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { error: "Invalid password" };
    }

    if (!user.isVerified) {
      return { error: "Please verify your email before signing in" };
    }

    const token = generateToken({
      _id: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      token,
      _id: user.id,
      email: user.email,
      username: user.username,
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAllUsersService = async () => {
  try {
    const users = await getAllUsers();
    return {
      success: true,
      message: "Users fetched successfully",
      status: 200,
      data: users,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error fetching users",
      message: error.message,
      status: 500,
      success: false,
    };
  }
};

export const updateUserService = async (id, userData) => {
  try {
    const user = await getuserbyId(id);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
        data: null,
      };
    }
    const updatedUser = await updateUser(id, userData);
    return {
      success: true,
      message: "User updated successfully",
      status: 200,
      data: updatedUser,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error in updating the user",
      status: 500,
      data: null,
    };
  }
};

export const checkifUserexistService = async (email) => {
  try {
    const user = await getuserbyEmail(email);
    if (!user) {
      return { error: "User not found" };
    }
    return user;
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const sendOtpViaBrevoService = async (email) => {
  try {
    const existingUser = await getuserbyEmail(email);

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    await saveOTP(email, otp);

    const sent = await sendOtpViaBrevo(email, otp);
    if (!sent) throw new Error("Failed to send OTP email");

    return { success: true, message: "OTP sent successfully" };
  } catch (err) {
    console.error("Error in sendOtpViaBrevoService:", err.message);
    return { success: false, message: err.message };
  }
};

export const verifyOTPService = async (email, otp) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const existingUser = await verifyOTP(email, otp);
  if (!existingUser) throw new Error("Invalid or expired OTP");

  return { message: "OTP verified successfully" };
};

export const resetPasswordService = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await getuserbyEmail(email);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await updateUserPassword(email, hashedPassword);
  return { message: "Password reset successful" };
};

export const verifyEmailService = async (email, token) => {
  if (!email || !token) {
    throw new Error("Email and token are required");
  }

  const verifiedUser = await verifyEmailToken(email, token);

  if (!verifiedUser) {
    throw new Error("Invalid or expired verification link");
  }

  return { message: "Email verified successfully" };
};
