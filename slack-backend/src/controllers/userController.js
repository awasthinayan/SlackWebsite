import user from "../DBLayer/userSchema.js";
import {
  registerUserService,
  loginUserService,
  sendOtpViaBrevoService,
  updateUserService,
} from "../Services/userService.js";

import {
  verifyOTPService,
  resetPasswordService,
  getAllUsersService,
  verifyEmailService,
} from "../Services/userService.js";

export const registerUserController = async (req, res) => {
  try {
    const user = await registerUserService(req.body);

    if (user?.error) {
      return res.status(400).json({
        message: user.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "user created successfully",
      status: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
      status: false,
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    const token = await loginUserService({ email, password });

    if (token?.error) {
      return res.status(401).json({
        message: token.error,
        status: false,
      });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      status: true,
      data: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({
      message: "ALl users fetched successfully",
      status: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: false,
      data: null,
      success: false,
      error: error,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;
    const result = await updateUserService(id, {
      username,
      password,
    });

    if (!result.success) {
      return res.status(result.status).json({
        message: result.message,
        status: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      status: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await sendOtpViaBrevoService(email);

    if (result.success) {
      return res.status(200).json({ message: result.message, status: true });
    } else {
      return res
        .status(400)
        .json({ message: result.message || "Failed to send OTP", status: false });
    }
  } catch (error) {
    console.error("Error in sendOTPController:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOTPService(email, otp);
    res.status(200).json({ ...result, status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, status: false });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await resetPasswordService(email, password);
    res.status(200).json({ ...result, status: true });
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { email, token } = req.body;
    const result = await verifyEmailService(email, token);
    res.status(200).json({ ...result, status: true });
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};
