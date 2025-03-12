import express from "express";
import appointmentController from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, appointmentController.bookSession);
router.post("/:id/decision", authMiddleware, appointmentController.handleAppointmentDecision);
router.post("/:id/cancel", authMiddleware, appointmentController.cancelAppointment);
router.post("/:id/reschedule", authMiddleware, appointmentController.requestReschedule);
router.post("/:id/reschedule-decision", authMiddleware, appointmentController.handleRescheduleDecision);

export default router;
