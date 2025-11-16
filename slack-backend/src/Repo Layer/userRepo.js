import e from "express";
import user from "../DB Layer/user.js";

export const createUser = async (userData) =>{
    return await user.create(userData);
}

export const getuserbyEmail = async (email) =>{
    return await user.findOne({email});
}

export const getAllUsers = async () =>{
    return await user.find({}).select("-password");
}   

export const getuserbyId = async (id) =>{
  console.log("id in repo",id);
    return await user.findOne({_id:id});
}

export const updateUser = async (id, userData) => {
   console.log("response from repo",id)
  return await user.findOneAndUpdate(
    { _id: id },
    userData,
    { new: true, runValidators: true }
  );
};

export const deleteUser = async (id) =>{
    return await user.findOneAndDelete({_id:id});
}

export const saveOTP = async (email, otp) => {
  const existingUser = await user.findOne({ email });
  if(!existingUser){
    return {error:"User not found"};
  }
  console.log(existingUser);
  existingUser.otp = otp;
  existingUser.otpExpires = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
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