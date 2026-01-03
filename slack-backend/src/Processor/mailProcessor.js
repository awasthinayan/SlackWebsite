import mailQueue from "../queues/mailQueue.js";
import mailer from "../config/mailConfig.js";

mailQueue.process(async (job)  => {
    const emailData = job.data;
    console.log("processing mail", emailData);

try {
    const response = await mailer.sendMail(emailData)
    console.log("Mail sent", response);
} catch (error) {
    console.log(error);
}
});
