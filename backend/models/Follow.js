import mongoose from "mongoose";
import env from "dotenv";

const followSchema = new mongoose.Schema({
    follower: {
        type: String,
        required: true,
    },  
    following: {
        type: String,
        required: true,
    },
});

const Follow = mongoose.model("follow", followSchema);

export default Follow;

