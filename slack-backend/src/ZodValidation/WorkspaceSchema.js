import { z } from "zod";

export const workspaceSchemaVaildation = z.object({
  workspaceName: z.string().min(3).max(30).optional(),
  description: z.string().min(3).max(100).optional(),

  members: z
    .array(
      z.object({
        memberId: z.string().min(3).max(30).optional(),
        role: z.string().min(3).max(30).optional(),
      }),
    )
    .optional(),

  JoinCode: z.string().min(3).max(30).optional(),

  channels: z
    .array(
      z.object({
        channelName: z.string().min(3).max(30).optional(),
      }),
    )
    .optional(),
});



export const CheckMemberSchemaValidation = z.object({
  memberId: z.string().min(3).max(30),
  role: z.string().min(3).max(30).optional(),
});

export const CheckChannelSchemaValidation = z.object({
  channelId: z.string().min(3).max(30),
});