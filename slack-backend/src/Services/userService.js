import { getuserbyEmail } from "../Repo Layer/userRepo.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { createUser } from "../Repo Layer/userRepo.js";
import { saveOTP,verifyOTP, updateUserPassword } from "../Repo Layer/userRepo.js"
import { sendOtpViaBrevo } from "../utils/sendOtpViaBrevo.js";


export const registerUserService = async (userData) =>{
    try{
          // some validation in server side

          const {email,password,username,name,phone,address,gender,dob} = userData;
          if(!email || !password || !username || !name || !phone || !address || !gender || !dob){
            return {error:"Please fill all the fields"};
          }
          
    const existingUser = await getuserbyEmail(userData.email);
    if(existingUser){
        return {error:"Email already exists"};
    }

    const hashedPassword = await bcrypt.hash(userData.password,10);

    const newUser = await createUser({
        username:userData.username,
        password:hashedPassword,
        email:userData.email,
        name:userData.name,
        phone:userData.phone,
        address:userData.address,
        gender:userData.gender,
        dob:userData.dob    
    });

    return newUser;  

    }  catch(error){
        console.log(error);
        return {error:error.message};
    }
}

export const loginUserService = async ({email,password}) =>{
    try{
        const user = await getuserbyEmail(email);
       if (!user) throw new Error("User not found");

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return {error:"Invalid password"};
        }

        const token = generateToken({id:user.id,email:user.email});
        return token;

    } catch(error){
        console.log(error);
        return {error:error.message};
    }

}

export const checkifUserexistService = async (email) =>{
    try{
        const user = await getuserbyEmail(email);
        if(!user){
            return {error:"User not found"};
        }
        return user;
    } catch(error){
        console.log(error);
        return {error:error.message};
    }
}


export const sendOtpViaBrevoService = async (email) => {
  try {
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
  const existingUser = await verifyOTP(email, otp);
  if (!existingUser) throw new Error("Invalid or expired OTP");
  console.log(existingUser);
  return { message: "OTP verified successfully" };
};

export const resetPasswordService = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await updateUserPassword(email, hashedPassword);
  return { message: "Password reset successful" };
};