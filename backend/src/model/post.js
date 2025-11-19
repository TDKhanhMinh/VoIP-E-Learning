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

export default mongoose.model("Post", postSchema);
