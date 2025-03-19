// export async function bookAppointment({ user_id, therapist_id, scheduled_at, session_type }) {
//     const token = localStorage.getItem("token");
//     const response = await fetch("https://empathaiv2-backend.onrender.com/appointments", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         user_id,
//         therapist_id,
//         scheduled_at,
//         session_type,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to book appointment");
//     }
//     return response.json();
//   }

// frontend/src/services/appointments/appointmentApi.js

// Base URL for your API - adjust as needed
const BASE_URL = "https://empathaiv2-backend.onrender.com/appointments";

/**
 * Book an appointment.
 * 
 * @param {Object} data - { therapist_id, scheduled_at, session_type, session_duration }
 * @returns {Object} - The booked appointment or an error message
 */
export async function bookAppointment(data) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to book appointment");
  }
  return response.json(); // { message, appointment }
}

/**
 * Approve/Reject an appointment (therapist only)
 * 
 * @param {string} appointmentId 
 * @param {string} decision - "accept" or "reject"
 */
export async function handleAppointmentDecision(appointmentId, decision) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BASE_URL}/${appointmentId}/decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ decision }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to handle appointment decision");
  }
  return response.json(); // e.g. { message: 'Appointment confirmed successfully!' }
}

/**
 * Cancel an appointment (user or therapist)
 * 
 * @param {string} appointmentId
 */
export async function cancelAppointment(appointmentId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BASE_URL}/${appointmentId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to cancel appointment");
  }
  return response.json(); // e.g. { message: 'Appointment cancelled successfully!' }
}

/**
 * Request to reschedule an appointment (user)
 * 
 * @param {string} appointmentId 
 * @param {string} newScheduledAt - new date/time in ISO string
 */
export async function requestReschedule(appointmentId, newScheduledAt) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BASE_URL}/${appointmentId}/reschedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ newScheduledAt }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to request reschedule");
  }
  return response.json(); // e.g. { message: 'Reschedule request sent successfully!' }
}

/**
 * Approve/Reject reschedule request (therapist only)
 * 
 * @param {string} appointmentId
 * @param {string} decision - "accept" or "reject"
 */
export async function handleRescheduleDecision(appointmentId, decision) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BASE_URL}/${appointmentId}/reschedule-decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ decision }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to handle reschedule decision");
  }
  return response.json(); // e.g. { message: 'Reschedule request accepted successfully!' }
}

// Add inside appointmentApi.js

/**
 * Fetch all appointments for a given therapist (therapist only)
 * 
 * @param {string} therapistId
 */
export async function getTherapistAppointments(therapistId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  // You need a new route in your backend, e.g. GET /appointments/therapist/:id
  const response = await fetch(`${BASE_URL}/therapist/${therapistId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Failed to fetch therapist appointments");
  }
  return response.json(); // array of appointments
}


