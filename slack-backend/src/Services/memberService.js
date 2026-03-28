
import { getuserbyId } from "../RepoLayer/userRepo.js";
import { getWorkspaceById, isUserisPartofWorkspace } from "../RepoLayer/WorkspaceRepo.js"

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const user = await getuserbyId(memberId);
  if (!user) {
    throw new Error("User not found");
  }

  const membership = await isUserisPartofWorkspace(workspaceId, memberId);

  if (membership.error) {
    throw new Error(membership.message);
  }

  if (!membership.isMember) {
    throw new Error("User is not part of workspace");
  }

  return user;
};

export const deleteMemberService = async (workspaceId, memberId, adminId) => {
  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  // 🔒 Prevent admin removing himself
  if (String(memberId) === String(adminId)) {
    throw new Error("Admin cannot be removed");
  }

  const user = await getuserbyId(memberId);
  if (!user) throw new Error("User not found");

  const isMember = workspace.members.some(
    (m) => String(m.memberId._id) === String(memberId)
  );

  if (!isMember) {
    throw new Error("User is not part of workspace");
  }

workspace.members.pull({ memberId });
await workspace.save();

return user;
};
