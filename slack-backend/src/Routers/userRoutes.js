import express from "express";
import V1userSignUp from "../V1/V1userSignUp.js";   
import V1userSignIn from "../V1/V1userSignIn.js";
import V1sendOTP from "../V1/V1sendOTP.js";
import V1verifyOTP from "../V1/V1verifyOTP.js";     
import V1resetPassword from "../V1/V1resetPassword.js";
import { SignInSchema } from "../ZodValidation/SignInSchema.js";
import { SignUpSchema } from "../ZodValidation/SignUpSchema.js";
import { validate } from "../ZodValidation/Validate.js";
import V1getAllUsers from "../V1/V1getAllUsers.js";
import V1updateUser from "../V1/V1updateUser.js";







const router = express.Router();

router.use("/V1/signup",validate(SignUpSchema),V1userSignUp);
router.use("/V1/signin",validate(SignInSchema),V1userSignIn);

router.use("/V1/allUsers",V1getAllUsers);

router.use("/V1", V1updateUser);

router.use("/V1/sendOTP",V1sendOTP);
router.use("/V1/verifyOTP",V1verifyOTP);
router.use("/V1/resetPassword",V1resetPassword);
export default router;

