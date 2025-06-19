// import React, { useState, useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchUpcomingAppointments } from "../services/appointmentApi";


// function RightSidebar({}) {
//   const navigate = useNavigate();
//   // activeSection can be "helpful", "appointments", "upcoming", or "availability"
//   const [activeSection, setActiveSection] = useState(null);

//   const [upcoming, setUpcoming] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const toggleSection = (section) => {
//     setActiveSection(activeSection === section ? null : section);
//   };

//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const isTherapist = currentUser.role === "therapist";

//   useEffect(() => {
//     if (activeSection !== "upcoming") return;
//     setLoading(true);
//     setErr("");
//     fetchUpcomingAppointments()
//       .then((data) => setUpcoming(data))
//       .catch((e) => setErr(e.message))
//       .finally(() => setLoading(false));
//   }, [activeSection]);

//   return (
//     <aside className="w-full h-full p-4 space-y-6">
//       {/* Helpful Links Accordion */}
//       <div className="bg-white shadow rounded">
//         <button
//           onClick={() => toggleSection("helpful")}
//           className="w-full text-left px-4 py-3 border-b border-gray-200 focus:outline-none"
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Helpful Links</h3>
//         </button>
//         {activeSection === "helpful" && (
//           <div className="p-4">
//             <ul className="space-y-2 text-emerald-600">
//               <li>
//                 <a
//                   href="https://www.mind.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Mind UK
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.cruse.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Cruse Bereavement Care
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.samaritans.org"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Samaritans
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.relate.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Relate UK
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.mentalhealth.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Mental Health Foundation
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.youngminds.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Young Minds
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.griefencounter.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Grief Encounter
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.childbereavementuk.org"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Child Bereavement UK
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.sobs.org.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Survivors of Bereavement by Suicide (SOBS)
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.crisistextline.uk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline"
//                 >
//                   Crisis Text Line UK
//                 </a>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Book Appointments Accordion */}
//       <div className="bg-white shadow rounded">
//         <button
//           onClick={() => toggleSection("appointments")}
//           className="w-full text-left px-4 py-3 border-b border-gray-200 focus:outline-none"
//         >
//           <h3 className="text-lg font-semibold text-gray-700">Book Appointments</h3>
//         </button>
//         {activeSection === "appointments" && (
//           <div className="p-4">
//             <button
//               onClick={() => navigate("/therapists")}
//               className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
//             >
//               Find a Therapist
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Upcoming Appointments Accordion */}
//       <div className="bg-white shadow rounded">
//         <button
//           onClick={() => toggleSection("upcoming")}
//           className="w-full text-left px-4 py-3 border-b border-gray-200 focus:outline-none"
//         >
//           <h3 className="text-lg font-semibold text-gray-700">
//             Upcoming Appointments
//           </h3>
//         </button>
//         {activeSection === "upcoming" && (
//           <div className="p-4">
//             {loading && <p>Loading…</p>}
//             {err && <p className="text-red-500">{err}</p>}
//             {!loading && !err && upcoming.length === 0 && (
//               <p className="text-gray-600">No upcoming appointments.</p>
//             )}
//             {!loading &&
//               !err &&
//               upcoming.map((appt) => {
//                 const when = new Date(appt.scheduled_at).toLocaleString();
//                 return (
//                   <div key={appt.id} className="mb-3">
//                     <p className="text-gray-800">
//                       With <strong>{appt.counterpart}</strong> on {when}
//                     </p>
//                   </div>
//                 );
//               })}
//           </div>
//         )}
//       </div>


//       {/* Therapist Availability Accordion (only visible to therapists) */}
//       {isTherapist && (
//         <div className="bg-white shadow rounded">
//           <button
//             onClick={() => navigate("/therapist/availability")}
//             className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
//           >
//             Add your Availability
//           </button>
//         </div>
//       )}
//     </aside>
//   );
// }

// export default RightSidebar;


// src/components/RightSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUpcomingAppointments } from "../services/appointmentApi";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTherapist = user.role === "therapist";

  useEffect(() => {
    if (activeSection === "upcoming") {
      setLoading(true);
      setErr("");
      fetchUpcomingAppointments()
        .then((data) => setUpcoming(data))
        .catch((e) => setErr(e.message))
        .finally(() => setLoading(false));
    }
  }, [activeSection]);

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  return (
    <aside className="w-full h-full p-4">
      {/* match left’s flex + gap spacing */}
      <div className="flex flex-col gap-4">
        {/* Helpful Links */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleSection("helpful")}
            className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition"
          >
            <span className="font-semibold text-gray-100">Helpful Links</span>
          </button>
          {activeSection === "helpful" && (
            <ul className="ml-4 space-y-1 text-gray-200 text-sm">
              {[
                ["Mind UK", "https://www.mind.org.uk"],
                ["Cruse", "https://www.cruse.org.uk"],
                ["Samaritans", "https://www.samaritans.org"],
                ["Relate UK", "https://www.relate.org.uk"],
                ["Mental Health Foundation", "https://www.mentalhealth.org.uk"],
                ["Young Minds", "https://www.youngminds.org.uk"],
                ["Grief Encounter", "https://www.griefencounter.org.uk"],
                ["Child Bereavement UK", "https://www.childbereavementuk.org"],
                ["SOBS", "https://www.sobs.org.uk"],
                ["Crisis Text Line UK", "https://www.crisistextline.uk"],
              ].map(([label, url]) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Book Appointments */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleSection("appointments")}
            className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition"
          >
            <span className="font-semibold text-gray-100">Book Appointments</span>
          </button>
          {activeSection === "appointments" && (
            <div className="ml-4">
              <button
                onClick={() => navigate("/therapists")}
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
              >
                Find a Therapist
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleSection("upcoming")}
            className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition"
          >
            <span className="font-semibold text-gray-100">
              Upcoming Appointments
            </span>
          </button>
          {activeSection === "upcoming" && (
            <ul className="ml-4 space-y-1 text-gray-200 text-sm">
              {loading && <li>Loading…</li>}
              {err && <li className="text-red-300">{err}</li>}
              {!loading && !err && upcoming.length === 0 && <li>No upcoming.</li>}
              {!loading &&
                !err &&
                upcoming.map((appt) => (
                  <li key={appt.id}>
                    With <strong>{appt.counterpart}</strong> at{" "}
                    {new Date(appt.scheduled_at).toLocaleString()}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Therapist Availability (if applicable) */}
        {isTherapist && (
          <button
            onClick={() => navigate("/therapist/availability")}
            className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
          >
            Add Availability
          </button>
        )}
      </div>
    </aside>
  );
}
