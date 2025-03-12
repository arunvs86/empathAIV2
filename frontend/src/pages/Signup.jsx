import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NotificationPopup = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
      >
        <svg
          className="fill-current h-6 w-6"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.172 7.066 4.238a1 1 0 10-1.414 1.414L8.586 8.586 5.652 11.52a1 1 0 101.414 1.414L10 9.999l2.934 2.935a1 1 0 101.414-1.414L11.414 8.586l2.934-2.934z" />
        </svg>
      </span>
    </div>
  );
};

const Signup = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    location: "",
    bio: "",
    religious_support: false,
    // Therapist Fields
    specialization_tags: "",
    experience_years: "",
    license_number: "",
    languages_spoken: "",
    session_duration: "",
    appointment_types: "",
    availability_preference: "weekly_schedule",
    // Admin Fields 
    permissions: {
      ban_users: true,
      remove_posts: true,
      approve_therapists: true,
    },
    // Bot Fields 
    bot_type: "chatbot",
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    if (inputType === "checkbox") {
      if (name in formData.permissions) {
        setFormData({
          ...formData,
          permissions: { ...formData.permissions, [name]: checked },
        });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {};
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
      location: formData.location,
      bio: formData.bio,
      religious_support: formData.religious_support,
      role: type,
    };

    if (type === "therapist") {
      const roleData = {
        specialization_tags: formData.specialization_tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience_years: Number(formData.experience_years),
        license_number: formData.license_number,
        languages_spoken: formData.languages_spoken
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        session_duration: Number(formData.session_duration),
        appointment_types: formData.appointment_types
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        availability_preference: formData.availability_preference,
      };
      payload = { userData, roleData };
    } else {
      payload = { userData };
    }

    try {
      const response = await fetch("http://localhost:5003/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
      const result = await response.json();
      setNotification({
        message: result.message || "Signup successful!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-md px-8 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-emerald-600">Welcome to EmpathAI</h1>
          <p className="text-gray-600 mt-2">
            Connecting hearts with empathy. Join us to share, support, and heal.
          </p>
        </div>
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <h2 className="text-3xl font-bold mb-8 text-center capitalize text-emerald-600">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-gray-700 font-semibold mb-2"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-gray-700 font-semibold mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>
            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 font-semibold mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            {/* Religious Support */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="religious_support"
                name="religious_support"
                checked={formData.religious_support}
                onChange={handleChange}
                className="mr-2"
              />
              <label
                htmlFor="religious_support"
                className="text-gray-700 font-semibold"
              >
                Require Religious Support
              </label>
            </div>
            {/* Bio */}
            <div className="md:col-span-2">
              <label
                htmlFor="bio"
                className="block text-gray-700 font-semibold mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="3"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              ></textarea>
            </div>
          </div>

          {/* Therapist Details */}
          {type === "therapist" && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Therapist Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialization Tags */}
                <div>
                  <label
                    htmlFor="specialization_tags"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Specialization Tags{" "}
                    <span className="text-xs text-gray-500">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="specialization_tags"
                    name="specialization_tags"
                    value={formData.specialization_tags}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* Experience Years */}
                <div>
                  <label
                    htmlFor="experience_years"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    id="experience_years"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* License Number */}
                <div>
                  <label
                    htmlFor="license_number"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    License Number
                  </label>
                  <input
                    type="text"
                    id="license_number"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* Languages Spoken */}
                <div>
                  <label
                    htmlFor="languages_spoken"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Languages Spoken{" "}
                    <span className="text-xs text-gray-500">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="languages_spoken"
                    name="languages_spoken"
                    value={formData.languages_spoken}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* Session Duration */}
                <div>
                  <label
                    htmlFor="session_duration"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Session Duration (mins)
                  </label>
                  <input
                    type="number"
                    id="session_duration"
                    name="session_duration"
                    value={formData.session_duration}
                    onChange={handleChange}
                    min="15"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* Appointment Types */}
                <div>
                  <label
                    htmlFor="appointment_types"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Appointment Types{" "}
                    <span className="text-xs text-gray-500">
                      (comma separated, e.g., text, voice, video)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="appointment_types"
                    name="appointment_types"
                    value={formData.appointment_types}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                {/* Availability Preference */}
                <div>
                  <label
                    htmlFor="availability_preference"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Availability Preference
                  </label>
                  <select
                    id="availability_preference"
                    name="availability_preference"
                    value={formData.availability_preference}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="weekly_schedule">Weekly Schedule</option>
                    <option value="custom_dates">Custom Dates</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
