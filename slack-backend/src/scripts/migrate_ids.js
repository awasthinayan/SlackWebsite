import connectDB from "../config/dbConfig.js";
import mongoose from "mongoose";
import Workspace from "../DBLayer/Workspace.js";
import Channel from "../DBLayer/Channel.js";
import User from "../DBLayer/userSchema.js";

const isObjectIdString = (s) => /^[0-9a-fA-F]{24}$/.test(s);

async function run() {
  await connectDB();

  const workspaces = await Workspace.find();
  console.log(`Found ${workspaces.length} workspaces`);

  for (const ws of workspaces) {
    let modified = false;

    // members
    for (let i = 0; i < ws.members.length; i++) {
      const m = ws.members[i];
      if (typeof m.memberId === "string") {
        if (isObjectIdString(m.memberId)) {
          ws.members[i].memberId = mongoose.Types.ObjectId(m.memberId);
          modified = true;
          console.log(
            `Converted string memberId to ObjectId for workspace ${ws._id}`
          );
        } else {
          // try to resolve to a real user by username/email/name
          const found = await User.findOne({
            $or: [
              { username: m.memberId },
              { email: m.memberId },
              { name: m.memberId },
            ],
          });
          if (found) {
            ws.members[i].memberId = found._id;
            modified = true;
            console.log(
              `Resolved memberId "${m.memberId}" -> ${found._id} in workspace ${ws._id}`
            );
          } else {
            console.log(
              `Skipping unresolved memberId "${m.memberId}" in workspace ${ws._id}`
            );
          }
        }
      }
    }

    // channels
    for (let i = 0; i < ws.channels.length; i++) {
      const ch = ws.channels[i];
      if (typeof ch === "string") {
        if (isObjectIdString(ch)) {
          ws.channels[i] = mongoose.Types.ObjectId(ch);
          modified = true;
          console.log(
            `Converted string channel id to ObjectId for workspace ${ws._id}`
          );
        } else {
          // create or find a Channel document for this name
          let chDoc = await Channel.findOne({ ChannelName: ch });
          if (!chDoc) {
            chDoc = await Channel.create({ ChannelName: ch });
            console.log(`Created Channel "${ch}" -> ${chDoc._id}`);
          } else {
            console.log(`Found existing Channel for "${ch}" -> ${chDoc._id}`);
          }
          ws.channels[i] = chDoc._id;
          modified = true;
        }
      }
    }

    if (modified) {
      await ws.save();
      console.log(`Saved updates to workspace ${ws._id}`);
    }
  }

  console.log("Migration complete");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
