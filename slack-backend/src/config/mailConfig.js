import nodemailer from "nodemailer"
import { MAIL_PASSWORD, MAIL_ID } from "./serverConfig.js";


export default nodemailer.createTransport({
  service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    user: MAIL_ID,
    pass: MAIL_PASSWORD
});