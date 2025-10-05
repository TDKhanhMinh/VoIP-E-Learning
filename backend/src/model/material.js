import mongoose from "mongoose";

const materialSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    file_url: { type: String, required: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    upload_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Material = mongoose.model("Meterial", materialSchema);
export default Material;
