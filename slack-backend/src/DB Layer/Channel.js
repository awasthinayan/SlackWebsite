import mongoose, { mongo } from "mongoose";
import { string } from "zod";

const ChannelSchema = new mongoose.Schema({
    ChannelName:{
        type:string,
        required:[true,"Channel name is required"],
        Unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

const Channel = mongoose.model("Channel",ChannelSchema)

export default Channel;