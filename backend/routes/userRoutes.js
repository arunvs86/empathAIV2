import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import UserController from "../controllers/userController.js";

const router = express.Router();
router.get("/", UserController.getUsersByIds);
// get profile‐level stats
router.get("/:id/stats", authMiddleware, UserController.getProfileStats);

// data by category
router.get("/:id/posts",   authMiddleware, UserController.getUserPosts);
router.get("/:id/journals",authMiddleware, UserController.getUserJournals);
router.get("/:id/communities", authMiddleware, UserController.getUserCommunities);
// router.get("/:id/habits",  authMiddleware, UserController.getUserHabits);
router.put("/:userId",authMiddleware, UserController.updateProfile);



export default router;