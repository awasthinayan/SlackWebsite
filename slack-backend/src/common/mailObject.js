import { MAIL_ID } from "../config/serverConfig.js"; 

export const workspacebyJoinMailObject = function(workspace){
    console.log("📮 Mail Data:", workspace);
    console.log("📮 Mail Data Name of the worksapce:", workspace.workspaceName);
    return {
        from:MAIL_ID,
        subject:"You have been added to workspace",
        text:`You have been added to workspace ${workspace.workspaceName}`,
    }
}
