// routes/letterRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import letterCtrl from "../controllers/letterController.js";

const router = express.Router();

router.post(   "/",        auth, letterCtrl.create);
router.get(    "/user",    auth, letterCtrl.listByUser);
router.get(    "/:id",     auth, letterCtrl.getOne);
router.put(    "/:id",     auth, letterCtrl.update);
router.delete( "/:id",     auth, letterCtrl.delete);

export default router;
