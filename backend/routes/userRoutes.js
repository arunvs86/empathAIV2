import express from "express";
import { getUsersByIds } from "../controllers/userController.js";

const router = express.Router();

// GET /users?ids=comma,separated,ids
router.get("/", getUsersByIds);

export default router;