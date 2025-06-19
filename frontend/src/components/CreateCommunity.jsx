// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function CreateCommunity({ onCommunityCreated }) {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     type: "public", // default to public
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Not authenticated. Please log in.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("https://empathaiv2-backend.onrender.com/communities", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || "Community creation failed");
//       }

//       const newCommunity = await response.json();
//       if (onCommunityCreated) {
//         onCommunityCreated(newCommunity);
//       }
//       // Navigate to communities list view if desired
//       navigate("/communities");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
//       <h2 className="text-2xl font-bold text-emerald-600 mb-4">
//         Create a New Community
//       </h2>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Community Name */}
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
//             Community Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             placeholder="Enter community name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           />
//         </div>
//         {/* Description */}
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             placeholder="Enter a description for the community"
//             rows="3"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           ></textarea>
//         </div>
//         {/* Type */}
//         <div className="mb-4">
//           <label htmlFor="type" className="block text-gray-700 font-semibold mb-2">
//             Type
//           </label>
//           <select
//             id="type"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           >
//             <option value="public">Public</option>
//             <option value="private">Private</option>
//           </select>
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           >
//             {loading ? "Creating..." : "Create Community"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CreateCommunity;

// src/components/CreateCommunity.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCommunity({ onCommunityCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "public",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://empathaiv2-backend.onrender.com/communities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Community creation failed");
      }
      const newCommunity = await res.json();
      onCommunityCreated?.(newCommunity);
      navigate("/communities");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/50 backdrop-blur-md rounded-2xl p-8 space-y-6">
      <h2 className="text-3xl font-calligraphy text-gray-900">
        Create a New Community
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-800 font-medium">
            Community Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="e.g. Mindful Writers"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/20 placeholder-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/70"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-gray-800 font-medium">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Short description…"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-white/20 placeholder-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/70 resize-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 text-gray-800 font-medium">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-white/20 text-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full px-6 py-2 transition disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Community"}
          </button>
        </div>
      </form>
    </div>
  );
}
