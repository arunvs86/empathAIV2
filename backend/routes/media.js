// routes/media.js
import express from "express";
import { upload } from "../config/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /media/upload
// - authMiddleware ensures only logged-in users can upload
// - upload.array("media", 5) accepts up to 5 files in the "media" field
router.post(
  "/upload",
  authMiddleware,
  upload.array("media", 5),
  (req, res) => {
    // req.files is an array; each file has .path = the Cloudinary URL
    const files = req.files.map((f) => ({
      url: f.path,
      resource_type: f.resource_type,
    }));
    res.status(200).json(files);
  }
);

export default router;
