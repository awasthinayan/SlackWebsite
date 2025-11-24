import { 
  createWorkspaceService,
  updateWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByNameService,
  getWorkspaceByJoinCodeService,
  addMemberToWorkspaceService,
  addChannelToWorkspaceService,
  fetchAllWorkspaceByMemberIdService,   
  getAllWorkspaceService

 } from "../Services/WorkspaceService.js";

 export const createWorkspaceController = async (req, res) => {
   try {
     const Createworkspace = await createWorkspaceService(req.body.workspaceName);
     if (Createworkspace?.error) {
      console.log(Createworkspace.error);
       return res.status(400).json({
         message: Createworkspace.error,
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
    const workspaceupdate = await updateWorkspaceService(req.body.workspaceName, req.body.description);
    if (workspaceupdate?.error) {
      console.log(workspaceupdate.error);
      return res.status(400).json({
        message: workspaceupdate.error,
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
    const deletedWorkspace = await deleteWorkspaceService(req.body.workspaceName);
    if (deletedWorkspace?.error) {
      console.log(deletedWorkspace.error);
      return res.status(400).json({
        message: deletedWorkspace.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace deleted successfully",
      status: true,
      data: deletedWorkspace,
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
      console.log(getWorkspaces.error);
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

export const getWorkspaceByNameController = async (req, res) => {
  try {
    const getWorkspaceByname = await getWorkspaceByNameService(req.body.workspaceName);
    if (getWorkspaceByname?.error) {
      console.log(getWorkspaceByname.error);
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
    const getWorkspaceByJoinCode = await getWorkspaceByJoinCodeService(req.body.JoinCode);
    if (getWorkspaceByJoinCode?.error) {
      console.log(getWorkspaceByJoinCode.error);
      return res.status(400).json({
        message: getWorkspaceByJoinCode.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "Workspace fetched successfully",
      status: true,
      data: getWorkspaceByJoinCode,
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
    const addMemberSpace = await addMemberToWorkspaceService(req.body.workspaceName, req.body.memberId, req.body.role);
    if (addMemberSpace?.error) {
      console.log(addMemberSpace.error);
      return res.status(400).json({
        message: addMemberSpace.error,
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
    const addChannelSpace = await addChannelToWorkspaceService(req.body.workspaceName, req.body.channelName);
    if (addChannelSpace?.error) {
      console.log(addChannelSpace.error);
      return res.status(400).json({
        message: addChannelSpace.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "Channel added successfully",
      status: true,
      data: addChannelSpace,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const fetchAllWorkspaceByMemberIdController = async (req, res) => {
  try {
    const fetchAllWorkspaceByMemberId = await fetchAllWorkspaceByMemberIdService(req.body.memberId);
    if (fetchAllWorkspaceByMemberId?.error) {
      console.log(fetchAllWorkspaceByMemberId.error);
      return res.status(400).json({
        message: fetchAllWorkspaceByMemberId.error,
        status: false,
      });
    }
    res.status(200).json({
      message: "All workspaces fetched successfully",
      status: true,
      data: fetchAllWorkspaceByMemberId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

