import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporter: {
        type: String,
        required: true,
    },
    reported: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    reportedtext : {
        type: String,
        required: true,
    },
    reportedpost : {
        ref: "post",
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 864000,
    },
    isIgnored: {
        type: Boolean,
        default: false,
        required: true,
    },
});

const Report = mongoose.model("report", reportSchema);

export default Report;