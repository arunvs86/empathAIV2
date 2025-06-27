// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchUpcomingAppointments } from "../services/appointmentApi";

// export default function RightSidebar() {
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState(null);
//   const [upcoming, setUpcoming] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const isTherapist = user.role === "therapist";

//   useEffect(() => {
//     if (activeSection === "upcoming") {
//       setLoading(true);
//       setErr("");
//       fetchUpcomingAppointments()
//         .then((data) => setUpcoming(data))
//         .catch((e) => setErr(e.message))
//         .finally(() => setLoading(false));
//     }
//   }, [activeSection]);

//   const toggleSection = (section) =>
//     setActiveSection(activeSection === section ? null : section);

//   return (
//     <aside className="w-full h-full p-4">
//       {/* match left’s flex + gap spacing */}
//       <div className="flex flex-col gap-4">
//         {/* Helpful Links */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => toggleSection("helpful")}
//             className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition"
//           >
//             <span className="font-semibold text-gray-100">Helpful Links</span>
//           </button>
//           {activeSection === "helpful" && (
//             <ul className="ml-4 space-y-1 text-gray-200 text-sm">
//               {[
//                 ["Mind UK", "https://www.mind.org.uk"],
//                 ["Cruse", "https://www.cruse.org.uk"],
//                 ["Samaritans", "https://www.samaritans.org"],
//                 ["Relate UK", "https://www.relate.org.uk"],
//                 ["Mental Health Foundation", "https://www.mentalhealth.org.uk"],
//                 ["Young Minds", "https://www.youngminds.org.uk"],
//                 ["Grief Encounter", "https://www.griefencounter.org.uk"],
//                 ["Child Bereavement UK", "https://www.childbereavementuk.org"],
//                 ["SOBS", "https://www.sobs.org.uk"],
//                 ["Crisis Text Line UK", "https://www.crisistextline.uk"],
//               ].map(([label, url]) => (
//                 <li key={label}>
//                   <a
//                     href={url}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="hover:underline"
//                   >
//                     {label}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Book Appointments */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => toggleSection("appointments")}
//             className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition"
//           >
//             <span className="font-semibold text-gray-100">Book Appointments</span>
//           </button>
//           {activeSection === "appointments" && (
//             <div className="ml-4">
//               <button
//                 onClick={() => navigate("/therapists")}
//                 className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
//               >
//                 Find a Therapist
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Upcoming Appointments */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => toggleSection("upcoming")}
//             className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-xl rounded-lg hover:bg-white/30 transition"
//           >
//             <span className="font-semibold text-gray-100">
//               Upcoming Appointments
//             </span>
//           </button>
//           {activeSection === "upcoming" && (
//             <ul className="ml-4 space-y-1 text-gray-200 text-sm">
//               {loading && <li>Loading…</li>}
//               {err && <li className="text-red-300">{err}</li>}
//               {!loading && !err && upcoming.length === 0 && <li>No upcoming.</li>}
//               {!loading &&
//                 !err &&
//                 upcoming.map((appt) => (
//                   <li key={appt.id}>
//                     With <strong>{appt.counterpart}</strong> at{" "}
//                     {new Date(appt.scheduled_at).toLocaleString()}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </div>

//         {/* Therapist Availability (if applicable) */}
//         {isTherapist && (
//           <button
//             onClick={() => navigate("/therapist/availability")}
//             className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition"
//           >
//             Add Availability
//           </button>
//         )}
//       </div>
//     </aside>
//   );
// }

// src/components/RightSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Link as LinkIcon, Calendar, Clock } from "lucide-react";
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

  // Card styles for consistency with left sidebar
  const cardClass =
    "flex items-center flex-shrink-0 gap-2 px-3 py-2 bg-white/30 hover:bg-white/40 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200";
  const iconClass = "w-5 h-5 text-white flex-shrink-0";
  const labelClass = "text-white font-semibold text-sm whitespace-nowrap";

  return (
    <aside className="w-full h-full p-4">
      <div className="flex flex-col gap-3">
        {/* Helpful Links */}
        <div>
          <button
            onClick={() => toggleSection("helpful")}
            className={cardClass}
          >
            <LinkIcon className={iconClass} />
            <span className={labelClass}>Helpful Links</span>
          </button>
          {activeSection === "helpful" && (
            <ul className="ml-8 space-y-1 text-white/90 text-sm">
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
        <div>
          <button
            // onClick={() => toggleSection("appointments")}
            onClick={() => navigate("/therapists")}
            className={cardClass}
          >
            {/* <BookOpen className={iconClass} /> */}
            <Calendar className="w-4 h-4" />
            <span className={labelClass}>Book Appointments</span>
          </button>
          {activeSection === "appointments" && (
            <div className="ml-8">
              <button
                // onClick={() => navigate("/therapists")}
                className="flex items-center gap-2 mt-1 bg-white/50 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <span className="text-sm font-medium">Find a Therapist</span>
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div>
          <button
            onClick={() => toggleSection("upcoming")}
            className={cardClass}
          >
            <Clock className={iconClass} />
            <span className={labelClass}>Upcoming Appointments</span>
          </button>
          {activeSection === "upcoming" && (
            <ul className="ml-8 space-y-1 text-white/90 text-sm">
              {loading && <li>Loading…</li>}
              {err && <li className="text-red-300">{err}</li>}
              {!loading && !err && upcoming.length === 0 && <li>No upcoming.</li>}
              {!loading &&
                !err &&
                upcoming.map((appt) => (
                  <li key={appt.id}>
                    With <strong>{appt.counterpart}</strong> at{' '}
                    {new Date(appt.scheduled_at).toLocaleString()}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Therapist Availability */}
        {isTherapist && (
          <button
            onClick={() => navigate("/therapist/availability")}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Add Availability</span>
          </button>
        )}
      </div>
    </aside>
  );
}
