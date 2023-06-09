import mongoose from "mongoose";
import env from "dotenv";

const subGreddiitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    banned_words: {
        type: Array,
        required: true,
    },
    moderators: {
        type: String,
        required: true,
    },
    followers: {
        type: Array,
        required: true,
    },
    blocked_users: {
        type: Array,
        required: true,
    },
    join_requests: {
        type: Array,
        required: true,
    },
    left_users: {
        type: Array,
        required: true,
    },
    posts: {
        type: Array,
        required: true,
    },
    reports: {
        type: Array,
        required: true,
    },

});

const Follow = mongoose.model("subGreddiits", subGreddiitSchema);

export default Follow;

