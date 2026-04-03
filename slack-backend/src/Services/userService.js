import {
  getAllUsers,
  getuserbyEmail,
  updateUser,
} from "../RepoLayer/userRepo.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { createUser } from "../RepoLayer/userRepo.js";
import {
  saveOTP,
  verifyOTP,
  updateUserPassword,
} from "../RepoLayer/userRepo.js";
import { sendOtpViaBrevo } from "../utils/sendOtpViaBrevo.js";
import { getuserbyId } from "../RepoLayer/userRepo.js";


export const registerUserService = async (userData) => {
  try {
    // some validation in server side

    const { email, password, username } =
      userData;
    if (
      !email ||
      !password ||
      !username 
    ) {
      return { error: "Please fill all the fields" };
    }

    const existingUser = await getuserbyEmail(userData.email);
    if (existingUser) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await createUser({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      gender: userData.gender,
      dob: userData.dob,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const loginUserService = async ({ email, password }) => {
  try {
    const user = await getuserbyEmail(email);
    if (!user) throw new Error("User not found");

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { error: "Invalid password" };
    }

    // Generate token using role from database ONLY
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return token;
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
    console.log("response from service", user);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
        data: null,
      };
    }
    const updatedUser = await updateUser(id, userData);
    console.log(updatedUser);
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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    // Save OTP in DB via Repo
    await saveOTP(email, otp);

    // Send OTP mail
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
  console.log(existingUser);
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
