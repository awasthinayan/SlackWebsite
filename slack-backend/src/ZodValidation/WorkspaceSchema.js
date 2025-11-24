import { z } from "zod";

const workspaceSchema = z.object({
  workspaceName: z.string().min(3).max(30).optional(),
  description: z.string().min(3).max(30).optional(),
  members: z.array(
    z.object({
      memberId: z.string().min(3).max(30).optional(),
      role: z.string().min(3).max(30).optional(),
    })
  ),  
  JoinCode: z.string().min(3).max(30).optional(),
  channels: z.array(
    z.object({
      channelName: z.string().min(3).max(30).optional(),
    })
  ),
  createdAt: z.string().min(3).max(30).optional(),
  updatedAt: z.string().min(3).max(30).optional(),
  
});

export default workspaceSchema;