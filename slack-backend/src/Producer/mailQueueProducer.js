import mailQueue from "../queues/mailQueue.js";
import "../Processor/mailProcessor.js";

export const addEmailtoMailQueue = async (emailData) => {
  try {
    const job = await mailQueue.add(emailData);
    return job;
  } catch (error) {
    console.log("Error in adding email to mail queue", error);
    return null;
  }
};
