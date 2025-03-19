import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TherapistAvailabilityForm() {
  const navigate = useNavigate();

  // State for new date entry and list of dates
  const [dateInput, setDateInput] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  
  // For time slots, we use an object mapping each date to an array of slots.
  const [timeSlotInput, setTimeSlotInput] = useState("");
  const [timeSlotsMap, setTimeSlotsMap] = useState({});
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to add a new date to the list
  const addDate = () => {
    if (dateInput && !selectedDates.includes(dateInput)) {
      setSelectedDates([...selectedDates, dateInput]);
      setDateInput("");
    }
  };

  // Function to add a time slot for a given date
  const addTimeSlot = (date) => {
    if (timeSlotInput) {
      const currentSlots = timeSlotsMap[date] || [];
      // Optionally: you can add validation for correct time format here
      setTimeSlotsMap({
        ...timeSlotsMap,
        [date]: [...currentSlots, timeSlotInput],
      });
      setTimeSlotInput("");
    }
  };

  // Handle form submission to set availability
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }
    
    // Build payload. The therapist_id may be inferred by backend from auth,
    // so we don't necessarily need to send it here.
    const payload = {
      selected_dates: selectedDates,
      selected_time_slots: timeSlotsMap,
    };

    try {
      const response = await fetch("https://empathaiv2-backend.onrender.com/therapists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to set availability");
      }
      const data = await response.json();
      setSuccess("Availability updated successfully!");
      // Optionally, navigate away or clear the form
      // navigate("/therapist/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Your Availability</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Section to add dates */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Add Date</label>
          <div className="flex">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="button"
              onClick={addDate}
              className="bg-emerald-600 text-white px-4 py-2 rounded-r hover:bg-emerald-700"
            >
              Add Date
            </button>
          </div>
        </div>

        {/* Display added dates with time slot inputs */}
        {selectedDates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Dates & Time Slots</h3>
            {selectedDates.map((date) => (
              <div key={date} className="border border-gray-200 rounded p-3 mb-4">
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">{date}</span>
                </div>
                {/* Display existing time slots for this date */}
                <ul className="list-disc ml-5 mb-2">
                  {timeSlotsMap[date] &&
                    timeSlotsMap[date].map((slot, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {slot}
                      </li>
                    ))}
                </ul>
                {/* Input for new time slot */}
                <div className="flex">
                  <input
                    type="text"
                    placeholder="e.g. 09:00-12:00"
                    value={timeSlotInput}
                    onChange={(e) => setTimeSlotInput(e.target.value)}
                    className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => addTimeSlot(date)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-r hover:bg-emerald-700"
                  >
                    Add Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
}

export default TherapistAvailabilityForm;
