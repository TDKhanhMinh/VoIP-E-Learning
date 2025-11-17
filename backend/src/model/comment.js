import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post_id: { type: String, required: true },
    author_id: { type: String, required: true },
    author_name: String,
    content: String,
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
