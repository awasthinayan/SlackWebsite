import express from "express";
import V1userSignUp from "../V1/V1userSignUp.js";   
import V1userSignIn from "../V1/V1userSignIn.js";
import V1sendOTP from "../V1/V1sendOTP.js";
import V1verifyOTP from "../V1/V1verifyOTP.js";     
import V1resetPassword from "../V1/V1resetPassword.js";




const router = express.Router();

router.use("/V1/signup",V1userSignUp);
router.use("/V1/signin",V1userSignIn);
router.use("/V1/sendOTP",V1sendOTP);
router.use("/V1/verifyOTP",V1verifyOTP);
router.use("/V1/resetPassword",V1resetPassword);
export default router;

