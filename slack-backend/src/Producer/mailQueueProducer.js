import mailQueue from "../queues/mailQueue.js";

export const addEmailtoMailQueue = async (emailData) => {
  try {
    const job = await mailQueue.add(emailData);
    console.log("Email added to mail queue", job.id);
    return job;
  } catch (error) {
    console.log("Error in adding email to mail queue", error);
    return null;
  }
};
