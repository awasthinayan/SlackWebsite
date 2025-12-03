import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const MONGO_URI = process.env.MONGO_URI 

export const JWT_SECRET = process.env.JWT_SECRET 

export const BREVO_API_KEY = process.env.BREVO_API_KEY 

export const NODE_ENV = process.env.NODE_ENV || "development";

export const PROD_DB_URL = process.env.PROD_DB_URL || "production";

export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || "1d";

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const MAIL_ID = process.env.MAIL_ID ;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PORT = process.env.REDIS_PORT || 6379;