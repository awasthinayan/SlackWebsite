
import user from "../DBLayer/userSchema.js";

export const createUser = async (userData) => {
  return await user.create(userData);
};

export const getuserbyEmail = async (email) => {
  return await user.findOne({ email });
};

export const getAllUsers = async () => {
  return await user.find({}).select("-password");
};

export const getuserbyId = async (id) => {
  return await user.findOne({ _id: id });
};

export const updateUser = async (id, userData) => {
  return await user.findOneAndUpdate({ _id: id }, userData, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id) => {
  return await user.findOneAndDelete({ _id: id });
};

export const saveOTP = async (email, otp) => {
  const existingUser = await user.findOne({ email });
  if (!existingUser) {
    return { error: "User not found" };
  }
  existingUser.otp = otp;
  existingUser.otpExpires = Date.now() + 5 * 60 * 1000; 
  await existingUser.save();
};

export const verifyOTP = async (email, otp) => {
  const existingUser = await user.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });
  return existingUser;
};

export const updateUserPassword = async (email, hashedPassword) => {
  const existingUser = await user.findOne({ email });
  existingUser.password = hashedPassword;
  existingUser.otp = undefined;
  existingUser.otpExpires = undefined;
  await existingUser.save();
};

export const saveEmailVerificationToken = async (email, token, expires) => {
  return await user.findOneAndUpdate(
    { email },
    {
      $set: {
        emailVerificationToken: token,
        emailVerificationExpires: expires,
      },
    },
    { new: true },
  );
};

export const verifyEmailToken = async (email, token) => {
  return await user.findOneAndUpdate(
    {
      email,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    },
    {
      $set: {
        isVerified: true,
      },
      $unset: {
        emailVerificationToken: "",
        emailVerificationExpires: "",
      },
    },
    { new: true },
  );
};
