import express from "express";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/download", async (req, res) => {
  try {
    let { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: "Missing public_id" });
    }

    if (public_id.endsWith(".zip")) {
      public_id = public_id.replace(".zip", "");
    }

    const url = cloudinary.utils.private_download_url(public_id, "zip", {
      resource_type: "raw",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    });

    res.json({ downloadUrl: url });
  } catch (error) {
    console.error("Error creating signed URL:", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

export default router;
