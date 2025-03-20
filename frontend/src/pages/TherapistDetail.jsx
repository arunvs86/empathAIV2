import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTherapistById, fetchTherapistAvailability } from "../services/therapistApi";
import { bookAppointment } from "../services/appointmentApi";

function TherapistDetail() {
  const { id } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        // 1) Fetch therapist details
        const tData = await fetchTherapistById(id);
        setTherapist(tData);

        // 2) Fetch availability
        const availData = await fetchTherapistAvailability(id);
        console.log(availData)
        setAvailability(availData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) return <p className="p-4">Loading therapist details...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!therapist) return <p className="p-4">Therapist not found.</p>;

  // Suppose availability looks like:
  // {
  //   "id": "...",
  //   "therapist_id": "...",
  //   "selected_dates": ["2025-03-10", "2025-03-11"],
  //   "selected_time_slots": {
  //     "2025-03-10": ["10:00", "11:00", "14:00"],
  //     "2025-03-11": ["09:30", "13:00"]
  //   }
  // }
  const selectedDates = availability?.selected_dates || [];
  const timeSlots = availability?.selected_time_slots || {};

  const handleBookSlot = async (date, timeRange) => {
    try {
      console.log("handleBookSlot called with date =", date, "timeRange =", timeRange);

      // If the time is something like "09:00-12:00", split on "-"
      let [startTime] = timeRange.split("-");
      // Trim any whitespace
      startTime = startTime.trim();

      // Combine date + startTime => "2025-03-10T09:00:00"
      const scheduledAtStr = `${date}T${startTime}:00`;
      console.log("scheduledAtStr =", scheduledAtStr);

      const scheduledAt = new Date(scheduledAtStr);
      console.log("scheduledAt =", scheduledAt);

      if (isNaN(scheduledAt.getTime())) {
        throw new Error("Invalid date/time format.");
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      if (!user.id || !token) {
        alert("Please log in to book an appointment.");
        return;
      }

      const payload = {
        user_id: user.id,
        therapist_id: therapist.id,
        scheduled_at: scheduledAt.toISOString(),
        session_duration: 60,
        session_type: "video",
      };

      const response = await fetch("https://empathaiv2-backend.onrender.com/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to book appointment");
      }

      const appointment = await response.json();
      alert(`Appointment booked! Confirmation ID: ${appointment.id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
      <div className="max-w-4xl mx-auto mt-6 px-4">
      {/* Therapist Info Card */}
      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {therapist.User?.username || "Therapist"}
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Specializations:{" "}
          <span className="text-gray-800 font-medium">
            {therapist.specialization_tags?.join(", ") || "N/A"}
          </span>
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Experience:{" "}
          <span className="text-gray-800 font-medium">
            {therapist.experience_years} years
          </span>
        </p>
        <p className="text-sm text-gray-600">
          License Number:{" "}
          <span className="text-gray-800 font-medium">
            {therapist.license_number}
          </span>
        </p>
      </div>

      {/* Availability Section */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Available Slots
        </h3>
        {selectedDates.length === 0 ? (
          <p className="text-gray-500">No available dates at the moment.</p>
        ) : (
          selectedDates.map((date) => (
            <div key={date} className="mb-6">
              <div className="bg-gray-50 p-2 rounded-md mb-2">
                <h4 className="text-md font-medium text-gray-700">
                  {new Date(date).toLocaleDateString()}
                </h4>
              </div>
              <div className="space-y-2">
                {timeSlots[date] && timeSlots[date].length > 0 ? (
                  timeSlots[date].map((time, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3"
                    >
                      <span className="text-sm text-gray-700">{time}</span>
                      <button
                        onClick={() => handleBookSlot(date, time)}
                        className="bg-emerald-600 text-white px-4 py-1 rounded text-sm hover:bg-emerald-700"
                      >
                        Book
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No time slots for this date.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TherapistDetail;
