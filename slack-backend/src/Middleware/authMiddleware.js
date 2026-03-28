import { checkifUserexistService } from "../Services/userService.js";
import { verifyToken } from "../utils/jwt.js";

export default async function authMiddleware(req, res, next) {
  try {
    // check if token is present in header
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // verify token

    const response = verifyToken(token);

    const doesUserExist = await checkifUserexistService(response.email);

    if (!doesUserExist) {
      return res.status(401).json({
        message: "User does not exist",
      });
    }
    req.user = response;

    console.log("user in authMiddleware", req.user);
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: 400,
      success: false,
    });
  }
}
