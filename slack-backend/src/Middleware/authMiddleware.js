import { checkifUserexistService } from "../Services/userService.js";
import { verifyToken } from "../utils/jwt.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const response = verifyToken(token);

    console.log("Decoded Token Payload:", response);

    const doesUserExist = await checkifUserexistService(response.email);

    if (!doesUserExist) {
      return res.status(401).json({
        message: "User does not exist",
      });
    }
    req.user = {
      ...response,
      _id: response._id || response.id,
    };
    console.log("req.user set to:", req.user);
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: 400,
      success: false,
    });
  }
}
