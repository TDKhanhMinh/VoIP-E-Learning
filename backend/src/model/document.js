import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", ""],
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    embedding: {
      type: [Number],
      required: true,
    },
    titleEmbedding: {
      type: [Number],
      default: null,
    },
    tagsEmbedding: {
      type: [Number],
      default: null,
    },
    levelEmbedding: {
      type: [Number],
      default: null,
    },
    descriptionEmbedding: {
      type: [Number],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ title: 1 });
DocumentSchema.index({ tags: 1 });
DocumentSchema.index({ level: 1 });

export default mongoose.model("Document", DocumentSchema);
