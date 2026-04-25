import {
  createWorkspaceService,
  updateWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByNameService,
  getWorkspaceByJoinCodeService,
  addMemberToWorkspaceService,
  addChannelToWorkspaceService,
  fetchAllWorkspaceByMemberIdService,
  getAllWorkspaceService,
  getWorkspaceDetailsService,
  resetWorkspaceJoinCodeService,
  joinWorkspaceBycodeService,
} from "../Services/WorkspaceService.js";

export const createWorkspaceController = async (req, res) => {
  try {
    const Createworkspace = await createWorkspaceService(
      req.body.workspaceName,
      req.body.description,
      req.user?._id,
    );
    if (Createworkspace?.error) {
      return res.status(400).json({
        message: Createworkspace.message,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace created successfully",
      status: true,
      data: Createworkspace,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const updateWorkspaceController = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceupdate = await updateWorkspaceService(
      id,
      req.body.workspaceName,
      req.body.description,
    );
    if (workspaceupdate?.error) {
      
      return res.status(400).json({
        message: workspaceupdate.message,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace updated successfully",
      status: true,
      data: workspaceupdate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const deleteWorkspaceController = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const result = await deleteWorkspaceService(workspaceId, req.user._id);

    if (result?.error) {
      return res.status(result.status).json({
        message: result.data.message,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace deleted successfully",
      status: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getAllWorkspaceController = async (req, res) => {
  try {
    const getWorkspaces = await getAllWorkspaceService();
    if (getWorkspaces?.error) {
      return res.status(400).json({
        message: getWorkspaces.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "All workspaces fetched successfully",
      status: true,
      data: getWorkspaces,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getWorkspaceDetailsController = async (req, res) => {
  try {
    const result = await getWorkspaceDetailsService(req.params.workspaceId);

    if (result?.error) {
      return res.status(result.status).json({
        message: result.data.message,
        status: false,
      });
    }

    return res.status(200).json({
      message: "Workspace details fetched successfully",
      status: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getWorkspaceByNameController = async (req, res) => {
  try {
    const getWorkspaceByname = await getWorkspaceByNameService(
      req.body.workspaceName,
    );
    if (getWorkspaceByname?.error) {
      return res.status(400).json({
        message: getWorkspaceByname.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace fetched successfully",
      status: true,
      data: getWorkspaceByname,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getWorkspaceByJoinCodeController = async (req, res) => {
  try {
    const getWorkspaceByJoinCode = await getWorkspaceByJoinCodeService(
      req.params.joinCode,
    );
    if (getWorkspaceByJoinCode?.error) {
      return res.status(400).json({
        message: getWorkspaceByJoinCode.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace fetched successfully",
      status: true,
      data: getWorkspaceByJoinCode.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const addMemberToWorkspaceController = async (req, res) => {
  try {
    const addMemberSpace = await addMemberToWorkspaceService(
      req.params.workspaceId,
      req.body.memberId,
      req.body.role,
      req.user?._id,
    );
    if (addMemberSpace?.error) {
      return res.status(addMemberSpace.status || 400).json({
        message: addMemberSpace.data?.message || "Failed to add member",
        status: false,
      });
    }
    res.status(200).json({
      message: "Member added successfully",
      status: true,
      data: addMemberSpace,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const addChannelToWorkspaceController = async (req, res) => {
  try {
    const result = await addChannelToWorkspaceService(
      req.body.workspaceName,
      req.body.channelId,
    );
    
    if (result.error) {
      return res.status(result.status).json({
        status: false,
        message: result.message,
        data: result.data,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Channel added successfully",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const fetchAllWorkspaceByMemberIdController = async (req, res) => {
  try {
    const result = await fetchAllWorkspaceByMemberIdService(req.user._id);

    if (result?.error) {
      return res.status(result.status || 500).json({
        message: result.message || result?.data?.message,
        status: false,
      });
    }
    res.status(200).json({
      message: "All workspaces fetched successfully",
      status: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const resetJoinCodeController = async (req, res) => {
  try {
    const response = await resetWorkspaceJoinCodeService(
      req.params.workspaceId,
      req.user
    );

    if (response?.error) {
      return res.status(response.status).json({
        message: response.data.message,
        status: false,
      });
    }

    return res.status(200).json({
      message: "Join code regenerated successfully",
      status: true,
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const joinWorkspaceBycodeController = async (req, res) => {
  try {
    const response = await joinWorkspaceBycodeService(
      req.params.workspaceId,
      req.params.joinCode,
      req.user,
    );

    if (response?.error) {
      return res.status(response.status).json({
        message: response.data.message,
        status: false,
      });
    }

    return res.status(200).json({
      message: "Joined workspace successfully",
      status: true,
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};  
