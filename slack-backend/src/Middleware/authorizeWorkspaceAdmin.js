import { getWorkspaceById } from "../RepoLayer/WorkspaceRepo.js";

export const authorizeWorkspaceOwner = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        error: true,
        message: "Workspace not found",
      });
    }

    const isAdmin = workspace.members.some(
      (m) =>
        String(m.memberId._id) === String(userId) &&
        m.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({
        error: true,
        message: "Only workspace admin can perform this action",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Authorization failed",
    });
  }
};
