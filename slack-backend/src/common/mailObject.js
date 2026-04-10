import { MAIL_ID } from "../config/serverConfig.js";

export const workspacebyJoinMailObject = function (workspace) {
  console.log("Mail Data:", workspace);
  console.log("Mail Data Name of the workspace:", workspace.workspaceName);
  return {
    from: MAIL_ID,
    subject: "You have been added to workspace",
    text: `You have been added to workspace ${workspace.workspaceName}`,
  };
};

export const emailVerificationMailObject = function ({
  username,
  verificationLink,
}) {
  return {
    from: MAIL_ID,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${username},</h2>
        <p>Thanks for registering. Please verify your email by clicking the button below:</p>
        <p>
          <a
            href="${verificationLink}"
            style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;"
          >
            Verify Email
          </a>
        </p>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `,
  };
};
