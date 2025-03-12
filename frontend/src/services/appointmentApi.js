export async function bookAppointment({ user_id, therapist_id, scheduled_at, session_type }) {
    const token = localStorage.getItem("token");
    const response = await fetch("https://empathaiv2-backend.onrender.com/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id,
        therapist_id,
        scheduled_at,
        session_type,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to book appointment");
    }
    return response.json();
  }