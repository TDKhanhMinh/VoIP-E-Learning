import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    class_id: { type: String, required: true },
    author_id: { type: String, required: true },
    author_name: String,
    content: String,
}, { timestamps: true });

export default mongoose.model("Post", postSchema);

