import mailQueue from "../queues/mailQueue.js";
import mailer from "../config/mailConfig.js";

mailQueue.process(async (job)  => {
    const emailData = job.data;
try {
    const response = await mailer.sendMail(emailData);
} catch (error) {
    console.log(error);
}
});
