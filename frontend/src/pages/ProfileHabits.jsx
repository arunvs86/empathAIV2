// // src/pages/ProfileHabits.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Edit2,
//   Trash2,
// } from "lucide-react";

// // ─── Animation variants ───────────────────────────
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };
// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.4 } },
// };

// // ─── Habit Editor Modal ───────────────────────────
// function HabitEditor({ habit, onSave, onCancel }) {
//   const [name, setName] = useState(habit?.name || "");
//   const [description, setDescription] = useState(habit?.description || "");
//   const [frequency, setFrequency] = useState(habit?.frequency || "daily");
//   const [weekdays, setWeekdays] = useState(habit?.schedule?.weekdays || []);
//   const [color, setColor] = useState(habit?.color || "#10B981");
//   const [icon, setIcon] = useState(habit?.icon || "🌱");

//   const toggleWeekday = (d) => {
//     setWeekdays((w) =>
//       w.includes(d) ? w.filter((x) => x !== d) : [...w, d]
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({
//       ...habit,
//       name,
//       description,
//       frequency,
//       schedule: { weekdays },
//       color,
//       icon,
//     });
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       exit="hidden"
//       variants={fadeInUp}
//       className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//     >
//       <motion.form
//         onSubmit={handleSubmit}
//         variants={fadeInUp}
//         className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 w-full max-w-lg mx-4"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">
//             {habit ? "Edit Habit" : "New Habit"}
//           </h2>
//           <button onClick={onCancel} className="text-gray-600 text-xl">
//             ×
//           </button>
//         </div>

//         <div className="space-y-4">
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Habit name"
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Description (optional)"
//             rows={2}
//             className="w-full border rounded px-3 py-2"
//           />

//           <div>
//             <label className="block font-semibold mb-1">Frequency</label>
//             <select
//               value={frequency}
//               onChange={(e) => setFrequency(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="custom">Custom</option>
//             </select>
//           </div>

//           {frequency === "weekly" && (
//             <div>
//               <label className="block font-semibold mb-1">Weekdays</label>
//               <div className="flex flex-wrap gap-2">
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
//                   (d, i) => (
//                     <button
//                       type="button"
//                       key={d}
//                       onClick={() => toggleWeekday(i)}
//                       className={`px-3 py-1 rounded ${
//                         weekdays.includes(i)
//                           ? "bg-emerald-600 text-white"
//                           : "bg-gray-200"
//                       }`}
//                     >
//                       {d}
//                     </button>
//                   )
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block font-semibold mb-1">Color</label>
//               <input
//                 type="color"
//                 value={color}
//                 onChange={(e) => setColor(e.target.value)}
//                 className="w-full h-10 p-0 border-none"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block font-semibold mb-1">Icon</label>
//               <input
//                 value={icon}
//                 onChange={(e) => setIcon(e.target.value)}
//                 className="w-full border rounded px-3 py-2 text-xl text-center"
//                 maxLength={2}
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </motion.form>
//     </motion.div>
//   );
// }

// // ─── Habit Log Editor ───────────────────────────
// function HabitLogEditor({ date, habits, logs, onSave, onCancel }) {
//   const [state, setState] = useState({});

//   useEffect(() => {
//     const dstr = date.toDateString();
//     const init = {};
//     habits.forEach((h) => {
//       init[h._id] = logs.some(
//         (l) =>
//           l.habitId === h._id &&
//           new Date(l.date).toDateString() === dstr
//       );
//     });
//     setState(init);
//   }, [date, habits, logs]);

//   const toggle = (id) => setState((s) => ({ ...s, [id]: !s[id] }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(date, state);
//   };

//   const label = date.toLocaleDateString(undefined, {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       exit="hidden"
//       variants={fadeInUp}
//       className="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
//     >
//       <motion.form
//         onSubmit={handleSubmit}
//         variants={fadeInUp}
//         className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl w-full max-w-md"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">Log Habits on {label}</h3>
//           <button onClick={onCancel} className="text-gray-600 text-xl">
//             ×
//           </button>
//         </div>
//         <div className="space-y-3">
//           {habits.map((h) => (
//             <label key={h._id} className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 checked={!!state[h._id]}
//                 onChange={() => toggle(h._id)}
//                 className="h-5 w-5 text-emerald-600"
//               />
//               <span className="font-semibold" style={{ color: h.color }}>
//                 {h.icon} {h.name}
//               </span>
//             </label>
//           ))}
//         </div>
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
//           >
//             Save
//           </button>
//         </div>
//       </motion.form>
//     </motion.div>
//   );
// }

// // ─── Habit Card ───────────────────────────────
// function HabitCard({ habit, logs, onEdit, onDelete, onToggleToday }) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const doneToday = logs.some(
//     (l) =>
//       l.habitId === habit._id &&
//       new Date(l.date).toDateString() === today.toDateString()
//   );

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={fadeInUp}
//       className="bg-white/50 backdrop-blur-lg rounded-2xl p-4 mb-4 flex justify-between items-center"
//     >
//       <div className="flex items-center gap-3">
//         <span className="text-2xl">{habit.icon}</span>
//         <div>
//           <h4 className="font-semibold text-gray-800">{habit.name}</h4>
//           <p className="text-sm text-gray-600">{habit.description}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <button
//           onClick={() => onToggleToday(habit._id, !doneToday)}
//           className={`px-3 py-1 rounded ${
//             doneToday ? `bg-[${habit.color}] text-white` : "bg-gray-200"
//           }`}
//         >
//           {doneToday ? "Done Today" : "Mark Done"}
//         </button>
//         <button onClick={() => onEdit(habit)} className="text-emerald-600">
//           <Edit2 />
//         </button>
//         <button onClick={() => onDelete(habit._id)} className="text-red-600">
//           <Trash2 />
//         </button>
//       </div>
//     </motion.div>
//   );
// }

// // ─── ProfileHabits Page ───────────────────────
// export default function ProfileHabits() {
//   const { userId } = useParams();
//   const [habits, setHabits] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showHabitEditor, setShowHabitEditor] = useState(false);
//   const [editingHabit, setEditingHabit] = useState(null);

//   const [showLogEditor, setShowLogEditor] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const fetchAll = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     const resH = await fetch("https://empathaiv2-backend.onrender.com/habits", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const habitsData = await resH.json();
//     setHabits(habitsData);

//     const allLogs = await Promise.all(
//       habitsData.map((h) =>
//         fetch(`https://empathaiv2-backend.onrender.com/habits/${h._id}/logs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }).then((r) => r.json())
//       )
//     );
//     setLogs(allLogs.flat());
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const dateSet = useMemo(() => {
//     const s = new Set();
//     logs.forEach((l) => s.add(new Date(l.date).toDateString()));
//     return s;
//   }, [logs]);

//   const handleLogClick = (date) => {
//     setSelectedDate(date);
//     setShowLogEditor(true);
//   };

//   const handleLogSave = async (date, state) => {
//     const token = localStorage.getItem("token");
//     await Promise.all(
//       Object.entries(state).map(([habitId, completed]) =>
//         fetch(`https://empathaiv2-backend.onrender.com/habits/${habitId}/log`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ date, completed }),
//         })
//       )
//     );
//     setShowLogEditor(false);
//     fetchAll();
//   };

//   const handleHabitSave = async (payload) => {
//     const token = localStorage.getItem("token");
//     const method = editingHabit ? "PUT" : "POST";
//     const url = editingHabit
//       ? `https://empathaiv2-backend.onrender.com/habits/${editingHabit._id}`
//       : "https://empathaiv2-backend.onrender.com/habits";
//     await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });
//     setShowHabitEditor(false);
//     setEditingHabit(null);
//     fetchAll();
//   };

//   const handleHabitDelete = async (id) => {
//     if (!confirm("Delete this habit?")) return;
//     const token = localStorage.getItem("token");
//     await fetch(`https://empathaiv2-backend.onrender.com/habits/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchAll();
//   };

//   const handleToggleToday = async (habitId, completed) => {
//     const token = localStorage.getItem("token");
//     const today = new Date().toISOString();
//     await fetch(`https://empathaiv2-backend.onrender.com/habits/${habitId}/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ date: today, completed }),
//     });
//     fetchAll();
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={fadeIn}
//       className="space-y-6 p-6"
//     >
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-calligraphy text-gray-900">
//           My Habits
//         </h2>
//         <button
//           onClick={() => {
//             setEditingHabit(null);
//             setShowHabitEditor(true);
//           }}
//           className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full"
//         >
//           <Plus /> New Habit
//         </button>
//       </div>

//       <AnimatePresence>
//         {showHabitEditor && (
//           <HabitEditor
//             habit={editingHabit}
//             onSave={handleHabitSave}
//             onCancel={() => setShowHabitEditor(false)}
//           />
//         )}
//         {showLogEditor && (
//           <HabitLogEditor
//             date={selectedDate}
//             habits={habits}
//             logs={logs}
//             onSave={handleLogSave}
//             onCancel={() => setShowLogEditor(false)}
//           />
//         )}
//       </AnimatePresence>

//       <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8">
//         <Calendar
//           prevLabel={<ChevronLeft className="text-emerald-600" />}
//           nextLabel={<ChevronRight className="text-emerald-600" />}
//           onClickDay={handleLogClick}
//           tileContent={({ date, view }) =>
//             view === "month" && dateSet.has(date.toDateString()) ? (
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="h-2 w-2 bg-emerald-600 rounded-full mx-auto mt-1"
//               />
//             ) : null
//           }
//           tileClassName={({ date, view }) =>
//             view === "month" && dateSet.has(date.toDateString())
//               ? "bg-emerald-50"
//               : ""
//           }
//           className="react-calendar border-none text-gray-800"
//         />
//       </div>

//       {loading ? (
//         <p className="text-gray-600">Loading habits…</p>
//       ) : (
//         habits.map((h) => (
//           <HabitCard
//             key={h._id}
//             habit={h}
//             logs={logs}
//             onEdit={(h) => {
//               setEditingHabit(h);
//               setShowHabitEditor(true);
//             }}
//             onDelete={handleHabitDelete}
//             onToggleToday={handleToggleToday}
//           />
//         ))
//       )}
//     </motion.div>
//   );
// }

// src/pages/ProfileHabits.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "lucide-react";

export default function ProfileHabits() {
  const { userId } = useParams();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditor, setShowEditor] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const [showLogEditor, setShowLogEditor] = useState(false);
  const [logDate, setLogDate] = useState(new Date());

  // ─── Fetch habits & logs ─────────────────────
  const loadAll = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const hRes = await fetch("https://empathaiv2-backend.onrender.com/habits", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const hData = await hRes.json();
    setHabits(hData);

    const all = await Promise.all(
      hData.map((h) =>
        fetch(`https://empathaiv2-backend.onrender.com/habits/${h._id}/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      )
    );
    setLogs(all.flat());
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ─── Calendar dot set ────────────────────────
  const dateSet = useMemo(() => {
    const s = new Set();
    logs.forEach((l) => s.add(new Date(l.date).toDateString()));
    return s;
  }, [logs]);

  // ─── Compute streak ──────────────────────────
  const streakFor = (h) => {
    let cnt = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (
        logs.some(
          (l) =>
            l.habitId === h._id &&
            new Date(l.date).toDateString() === d.toDateString()
        )
      ) {
        cnt++;
      } else break;
    }
    return cnt;
  };

  // ─── Handlers ───────────────────────────────
  const saveHabit = async (data) => {
    const token = localStorage.getItem("token");
    const method = data._id ? "PUT" : "POST";
    const url = data._id
      ? `https://empathaiv2-backend.onrender.com/habits/${data._id}`
      : "https://empathaiv2-backend.onrender.com/habits";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    setShowEditor(false);
    setEditHabit(null);
    loadAll();
  };

  const deleteHabit = async (id) => {
    if (!confirm("Delete this habit?")) return;
    const token = localStorage.getItem("token");
    await fetch(`https://empathaiv2-backend.onrender.com/habits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadAll();
  };

  const toggleToday = async (hid, done) => {
    const token = localStorage.getItem("token");
    await fetch(`https://empathaiv2-backend.onrender.com/habits/${hid}/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: new Date().toISOString(), completed: done }),
    });
    loadAll();
  };

  const saveLog = async (date, state) => {
    const token = localStorage.getItem("token");
    await Promise.all(
      Object.entries(state).map(([hid, done]) =>
        fetch(`https://empathaiv2-backend.onrender.com/habits/${hid}/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date, completed: done }),
        })
      )
    );
    setShowLogEditor(false);
    loadAll();
  };

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading habits…</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Habits</h1>
        <button
          onClick={() => {
            setEditHabit(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6">
        <Calendar
          prevLabel={<ChevronLeft className="text-emerald-600" />}
          nextLabel={<ChevronRight className="text-emerald-600" />}
          onClickDay={(d) => {
            setLogDate(d);
            setShowLogEditor(true);
          }}
          tileClassName={({ date, view }) =>
            view === "month" && dateSet.has(date.toDateString())
              ? "bg-emerald-100 rounded"
              : ""
          }
        />
      </div>

      {/* Habit Cards */}
      <div className="space-y-4">
        {habits.map((h) => {
          const done = logs.some(
            (l) =>
              l.habitId === h._id &&
              new Date(l.date).toDateString() === new Date().toDateString()
          );
          const streak = streakFor(h);
          return (
            <div
              key={h._id}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{h.name}</h2>
                {h.tags?.length > 0 && (
                  <p className="text-sm text-gray-700">
                    Tags: {h.tags.join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  🔥 Streak: {streak} day{streak !== 1 && "s"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleToday(h._id, !done)}
                  className={`px-3 py-1 rounded ${
                    done ? "bg-emerald-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {done ? "Done Today" : "Mark Done"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditHabit(h);
                    setShowEditor(true);
                  }}
                >
                  <Edit2 className="text-emerald-600" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteHabit(h._id)}
                >
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Habit Editor Modal */}
      {showEditor && (
        <HabitEditor
          habit={editHabit}
          onSave={saveHabit}
          onCancel={() => setShowEditor(false)}
        />
      )}

      {/* Log Editor Modal */}
      {showLogEditor && (
        <HabitLogEditor
          date={logDate}
          habits={habits}
          logs={logs}
          onSave={saveLog}
          onCancel={() => setShowLogEditor(false)}
        />
      )}
    </div>
  );
}

// ─── Habit Editor ───────────────────────────────
function HabitEditor({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(
    habit?.description || ""
  );
  const [frequency, setFrequency] = useState(
    habit?.frequency || "daily"
  );
  const [weekdays, setWeekdays] = useState(
    habit?.schedule?.weekdays || []
  );
  const [color, setColor] = useState(habit?.color || "#10B981");
  const [icon, setIcon] = useState(habit?.icon || "🌱");
  const [tags, setTags] = useState(habit?.tags || []);

  const toggleWeekday = (d) =>
    setWeekdays((w) =>
      w.includes(d) ? w.filter((x) => x !== d) : [...w, d]
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...habit,
      name,
      description,
      frequency,
      schedule: { weekdays },
      color,
      icon,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {habit ? "Edit Habit" : "New Habit"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={2}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. wellness, water"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          <div>
            <label className="block mb-1">Frequency</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {frequency === "weekly" && (
            <div>
              <label className="block mb-1">Weekdays</label>
              <div className="flex flex-wrap gap-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>(
                  <button
                    key={d}
                    type="button"
                    onClick={()=>toggleWeekday(i)}
                    className={`px-3 py-1 rounded ${
                      weekdays.includes(i)
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Color</label>
              <input
                type="color"
                className="w-full h-10 border-0 p-0"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Icon</label>
              <input
                className="w-full border rounded px-3 py-2 text-xl text-center"
                maxLength={2}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Habit Log Editor ──────────────────────────
function HabitLogEditor({ date, habits, logs, onSave, onCancel }) {
  const [state, setState] = useState({});

  useEffect(() => {
    const key = date.toDateString();
    const initial = {};
    habits.forEach(h => {
      initial[h._id] = logs.some(
        l => 
          l.habitId === h._id &&
          new Date(l.date).toDateString() === key
      );
    });
    setState(initial);
  }, [date, habits, logs]);

  const toggle = id => setState(s => ({ ...s, [id]: !s[id] }));

  const submit = e => {
    e.preventDefault();
    onSave(date, state);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <form
        onSubmit={submit}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Log for {date.toLocaleDateString()}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-2 mb-4 max-h-64 overflow-auto">
          {habits.map(h => (
            <label key={h._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!state[h._id]}
                onChange={()=>toggle(h._id)}
                className="h-5 w-5 text-emerald-600"
              />
              <span style={{color:h.color}} className="font-medium">
                {h.icon} {h.name}
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
