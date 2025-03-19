import TherapistAvailability from "../../models/TherapistAvailability.js";
import Therapist from "../../models/Therapist.js";
import User from "../../models/User.js";

Therapist.belongsTo(User, { foreignKey: "user_id" });


class TherapistAvailabilityService {
  /**
   * Create or Update Therapist Availability
   */
  async getAllTherapists() {
    const therapists = await Therapist.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "profile_picture"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    return therapists;
  }

  async getTherapistById(therapistId) {
    const therapist = await Therapist.findOne({
      where: { id: therapistId },
      include: [
        {
          model: User,
          attributes: ["username", "profile_picture"],
        },
      ],
    });
    if (!therapist) throw new Error("Therapist not found");
    return therapist;
  }
  
  async setAvailability(therapistId, availabilityData) {
    let availability = await TherapistAvailability.findOne({ where: { therapist_id: therapistId } });

    const therapist = await Therapist.findOne({ where: { user_id: therapistId } });
    if (!therapist) {
      throw new Error("Therapist does not exist. Ensure the account is verified." + therapistId);
    }

    // If no availability record, create a new one
    if (!availability) {
      availability = await TherapistAvailability.create({
        therapist_id: therapist.id,
        selected_dates: availabilityData.selected_dates || [],
        selected_time_slots: availabilityData.selected_time_slots || {},
        availability_type: availabilityData.availability_type || "manual",
        ai_input_text: availabilityData.ai_input_text || null,
        ai_processed_slots: availabilityData.ai_processed_slots || {}
      });
    } else {
      // Otherwise update the existing record
      await availability.update({
        selected_dates: availabilityData.selected_dates || [],
        selected_time_slots: availabilityData.selected_time_slots || {},
        availability_type: availabilityData.availability_type || "manual",
        ai_input_text: availabilityData.ai_input_text || null,
        ai_processed_slots: availabilityData.ai_processed_slots || {}
      });
    }

    return { message: "Availability updated successfully!" };
  }

  /**
   * Fetch Therapist Availability by therapist_id
   */
  async getAvailability(therapistId) {
    const availability = await TherapistAvailability.findOne({ where: { therapist_id: therapistId } });
    if (!availability) throw new Error("No availability set for this therapist.");
    return availability;
  }

  /**
   * Fetch ALL Availabilities (optional - for debugging/admin)
   */
  async listAllAvailabilities() {
    return await TherapistAvailability.findAll();
  }

  /**
   * Update Existing Availability
   */
  async updateAvailability(therapistId, updatedData) {
    const availability = await TherapistAvailability.findOne({ where: { therapist_id: therapistId } });
    if (!availability) throw new Error("No availability found for this therapist.");

    await availability.update(updatedData);
    return { message: "Availability updated successfully!" };
  }

  /**
   * Delete a Specific Time Slot
   */
  async deleteTimeSlot(therapistId, date, timeSlot) {
    const availability = await TherapistAvailability.findOne({ where: { therapist_id: therapistId } });
    if (!availability) throw new Error("No availability found for this therapist.");

    if (availability.selected_time_slots[date]) {
      // Remove the matching slot from the array
      availability.selected_time_slots[date] =
        availability.selected_time_slots[date].filter(slot => slot !== timeSlot);

      // If no slots left for that date, remove the date key
      if (availability.selected_time_slots[date].length === 0) {
        delete availability.selected_time_slots[date];
      }
    }

    await availability.save();
    return { message: "Time slot removed successfully!" };
  }

  /**
   * Mark a Time Slot as Booked
   * (Useful if you want to remove or flag a slot once it's booked)
   */
  async markSlotAsBooked(therapistId, date, timeSlot) {
    const availability = await TherapistAvailability.findOne({ where: { therapist_id: therapistId } });
    if (!availability) throw new Error("No availability found for this therapist.");

    // Example approach: remove it from selected_time_slots
    if (availability.selected_time_slots[date]) {
      availability.selected_time_slots[date] =
        availability.selected_time_slots[date].filter(slot => slot !== timeSlot);

      if (availability.selected_time_slots[date].length === 0) {
        delete availability.selected_time_slots[date];
      }
    }

    // Or set availability.status = "booked" if you prefer to mark it instead
    // availability.status = "booked";

    await availability.save();
    return { message: `Slot ${timeSlot} on ${date} is now booked.` };
  }
}

export default new TherapistAvailabilityService();
