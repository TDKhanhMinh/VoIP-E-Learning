import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    class_id: { type: String, required: false },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: false,
    },
    author_id: { type: String, required: true },
    author_name: String,
    content: String,
    title: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: false,
    },
  },
  { timestamps: true }
);
postSchema.index({ class_id: 1, topic_id: 1 });
postSchema.index({ topic_id: 1, createdAt: -1 });
postSchema.index({ created_by: 1 });
export default mongoose.model("Post", postSchema);
