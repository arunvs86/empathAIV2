import express from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router();

// CREATE
router.post("/", authMiddleware, postController.createPost);

// FETCH ALL
router.get("/", postController.getAllPosts);

// FETCH BY USER — must go BEFORE /:id
router.get(
  "/user/:userId",
  authMiddleware,
  postController.getPostsByUser
);
router.get("/:id", postController.getPostById);
router.put("/:id", authMiddleware, postController.updatePost);
router.delete("/:id", authMiddleware, postController.deletePost);
router.post("/:id/comment", authMiddleware, postController.addComment);
router.get("/:id/comments", postController.getComments);
router.delete("/:postId/comment/:commentId", authMiddleware, postController.deleteComment);
router.post("/:id/report", authMiddleware, postController.reportPost);
router.get("/reported", authMiddleware, postController.getReportedPosts);
router.put("/:id/moderate", authMiddleware, postController.moderatePost);
router.get("/community/:communityId", postController.getCommunityPosts);

export default router;
