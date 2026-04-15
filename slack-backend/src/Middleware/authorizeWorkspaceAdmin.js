import { getWorkspaceById } from "../RepoLayer/WorkspaceRepo.js";

export const authorizeWorkspaceOwner = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    
    // 1. Safety check: Handle 'id' vs '_id' from the authMiddleware
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: true,
        message: "User not authenticated",
      });
    }

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: true,
        message: "Workspace not found",
      });
    }

    // 2. Robust Admin Check: Handles both populated and unpopulated memberId
    const isAdmin = workspace.members.some((m) => {
      const memberIdInDb = m.memberId?._id 
        ? m.memberId._id.toString() 
        : m.memberId.toString();
        
      return memberIdInDb === userId.toString() && m.role === "admin";
    });

    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only workspace admin can perform this action",
      });
    }

    // 3. Optional: Pass the workspace object to the next controller 
    // to avoid refetching it in the service layer
    req.workspace = workspace;

    next();
  } catch (error) {
    console.error("Authorization Error:", error);
    return res.status(500).json({
      error: true,
      message: "Authorization failed",
    });
  }
};