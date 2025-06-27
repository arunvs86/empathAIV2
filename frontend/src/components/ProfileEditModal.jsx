// components/ProfileEditModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ProfileEditModal({ userId, onClose, onSaved }) {
  const stored = JSON.parse(localStorage.getItem("user")||"{}");
  const isTherapist = stored.role === "therapist";
  const [form, setForm] = useState({
    username: stored.username||"",
    bio:     stored.bio||"",
    profile_picture: stored.profile_picture||"",
    dob:     stored.dob||"",
    gender:  stored.gender||"",
    country: stored.country||"",
    city:    stored.city||"",
    faith_support: stored.faith_support||false,
    // therapist fields:
    experience_years:   isTherapist ? stored.experience_years : undefined,
    license_number:     isTherapist ? stored.license_number : undefined,
    languages_spoken:   isTherapist ? stored.languages_spoken.join(",") : undefined,
    session_duration:   isTherapist ? stored.session_duration : undefined,
    appointment_types:  isTherapist ? stored.appointment_types.join(",") : undefined,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        // include only defined keys
        username: form.username,
        bio: form.bio,
        profile_picture: form.profile_picture,
        dob: form.dob,
        gender: form.gender,
        country: form.country,
        city: form.city,
        faith_support: form.faith_support,
        ...(isTherapist && {
          experience_years: Number(form.experience_years),
          license_number: form.license_number,
          languages_spoken: form.languages_spoken.split(",").map(s=>s.trim()),
          session_duration: Number(form.session_duration),
          appointment_types: form.appointment_types.split(",").map(s=>s.trim())
        })
      };

      console.log('payload', payload)
      const res = await fetch(
        `https://empathaiv2-backend.onrender.com/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      console.log("Response",updated)
      localStorage.setItem("user", JSON.stringify(updated.user||updated));
      onSaved();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        {/* Example fields: */}
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Username"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Bio"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer not to say">Prefer not to say</option>
        </select>
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Country"
        />
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="City"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="faith_support"
            checked={form.faith_support}
            onChange={handleChange}
          />
          Include faith-based support
        </label>

        {/* Therapist-only */}
        {isTherapist && (
          <>
            <input
              type="number"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Years of Experience"
            />
            <input
              name="license_number"
              value={form.license_number}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="License Number"
            />
            <input
              name="languages_spoken"
              value={form.languages_spoken}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Languages (comma-separated)"
            />
            <input
              type="number"
              name="session_duration"
              value={form.session_duration}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Session Duration (mins)"
            />
            <input
              name="appointment_types"
              value={form.appointment_types}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Appointment Types (comma-separated)"
            />
          </>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
