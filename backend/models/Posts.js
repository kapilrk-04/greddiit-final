import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        ref: "user",
        required: true,
    },
    sub: {
        type: String,
        ref: "subgreddiit",
        required: true,
    },
    upvotes: [
        {
            type: String,
            ref: "user",
        },
    ],
    downvotes: [
        {
            type: String,
            ref: "user",
        },
    ],
    comments: [
        {
            type: String,
        }
    ],
    isComment: {
        type: Boolean,
        required: true,
    },
});

const Post = mongoose.model("post", postSchema);

export default Post;

