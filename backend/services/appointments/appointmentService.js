import Appointments from "../../models/Appointments.js";
import Therapist from "../../models/Therapist.js";
import TherapistAvailability from "../../models/TherapistAvailability.js";
import User from "../../models/User.js";
import emailService from "../email/emailService.js";

class AppointmentService {
    /**
     *  Book a Therapy Session
     */
    async bookSession(userId, appointmentData) {
        const { therapist_id, scheduled_at, session_type, session_duration } = appointmentData;

        const user = await User.findByPk(userId)
        console.log(user)
        const therapistDetails = await Therapist.findByPk(therapist_id)
        const therapist = await User.findByPk(therapistDetails.user_id)
        console.log(therapist)
        const availability = await TherapistAvailability.findOne({ where: { therapist_id } });
        if (!availability) throw new Error("Therapist has not set availability.");

        const requestedDate = scheduled_at.split("T")[0]; 
        const requestedTime = scheduled_at.split("T")[1]; 

        if (
            !availability.selected_time_slots ||
            typeof availability.selected_time_slots !== "object" ||
            !availability.selected_time_slots.hasOwnProperty(requestedDate) ||
            !Array.isArray(availability.selected_time_slots[requestedDate]) ||
            !availability.selected_time_slots[requestedDate].some(slot => requestedTime >= slot.split("-")[0] && requestedTime < slot.split("-")[1])
        ) {
            throw new Error("Therapist is not available at the requested time.");
        }

        const newAppointment = await Appointments.create({
            user_id: userId,
            therapist_id,
            scheduled_at,
            session_duration,
            session_type,
            status: "pending"
        });

        await emailService.sendAppointmentConfirmationEmail(newAppointment, user, therapist);


        return { message: "Appointment request sent successfully!", appointment: newAppointment };
    }

    /**
     *  Accept/Reject an Appointment Request
     */
    async handleAppointmentDecision(therapistId, appointmentId, decision) {
        const appointment = await Appointments.findOne({ where: { id: appointmentId, therapist_id: therapistId } });
        if (!appointment) throw new Error("Appointment not found or unauthorized.");

        if (appointment.status !== "pending") {
            throw new Error("Appointment has already been processed.");
        }

        if (decision === "accept") {
            appointment.status = "confirmed";
        } else if (decision === "reject") {
            appointment.status = "rejected";
        } else {
            throw new Error("Invalid decision. Use 'accept' or 'reject'.");
        }

        await appointment.save();
        return { message: `Appointment ${appointment.status} successfully!` };
    }

    async cancelAppointment(userId, appointmentId, role) {
        const appointment = await Appointment.findOne({ where: { id: appointmentId } });
        if (!appointment) throw new Error("Appointment not found.");

        if (role !== "therapist" && role !== "user") {
            throw new Error("Unauthorized: Only users or therapists can cancel sessions.");
        }

        if (role === "user" && appointment.user_id !== userId) {
            throw new Error("Unauthorized: You can only cancel your own appointments.");
        }

        if (role === "therapist" && appointment.therapist_id !== userId) {
            throw new Error("Unauthorized: You can only cancel your own sessions.");
        }

        if (appointment.status !== "pending" && appointment.status !== "confirmed") {
            throw new Error("Cannot cancel an appointment that is already processed.");
        }

        appointment.status = "cancelled";
        await appointment.save();

        return { message: "Appointment cancelled successfully!" };
    }

    async requestReschedule(userId, appointmentId, newScheduledAt) {
        const appointment = await Appointment.findOne({ where: { id: appointmentId } });
        if (!appointment) throw new Error("Appointment not found.");

        
        if (appointment.user_id !== userId) {
            throw new Error("Unauthorized: You can only reschedule your own appointments.");
        }

        if (appointment.status !== "confirmed") {
            throw new Error("Only confirmed appointments can be rescheduled.");
        }

        const availability = await TherapistAvailability.findOne({ where: { therapist_id: appointment.therapist_id } });
        if (!availability) throw new Error("Therapist has not set availability.");

        const requestedDate = newScheduledAt.split("T")[0]; 
        const requestedTime = newScheduledAt.split("T")[1]; 

        if (!availability.selected_time_slots[requestedDate] ||
            !availability.selected_time_slots[requestedDate].some(slot => requestedTime >= slot.split("-")[0] && requestedTime < slot.split("-")[1])) {
            throw new Error("Therapist is not available at the requested time.");
        }

        appointment.status = "reschedule_pending";
        appointment.scheduled_at = newScheduledAt;
        await appointment.save();

        return { message: "Reschedule request sent successfully!" };
    }

    /**
     *  Approve/Reject Rescheduling Request
     */
    async handleRescheduleDecision(therapistId, appointmentId, decision) {
        const appointment = await Appointment.findOne({ where: { id: appointmentId, therapist_id: therapistId } });
        if (!appointment) throw new Error("Appointment not found or unauthorized.");

        if (appointment.status !== "reschedule_pending") {
            throw new Error("No pending reschedule request for this appointment.");
        }

        if (decision === "accept") {
            appointment.status = "confirmed";
        } else if (decision === "reject") {
            appointment.status = "confirmed"; 
        } else {
            throw new Error("Invalid decision. Use 'accept' or 'reject'.");
        }

        await appointment.save();
        return { message: `Reschedule request ${decision}ed successfully!` };
    }

    async getAppointmentsByTherapist(therapistId) {
        // Find all appointments where the therapist_id matches the provided therapistId.
        // We order them by created_at in descending order (newest first).
        const appointments = await Appointments.findAll({
          where: { therapist_id: therapistId },
          order: [["created_at", "DESC"]],
        });
        return appointments;
      }
}

export default new AppointmentService();
