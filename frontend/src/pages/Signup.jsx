
// import React, { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate,Link } from "react-router-dom";
// import CreatableSelect from 'react-select/creatable';

// // NotificationPopup component
// const NotificationPopup = ({ message, type, onClose }) => {
//   const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
//   const borderColor = type === "success" ? "border-green-400" : "border-red-400";
//   const textColor = type === "success" ? "text-green-700" : "text-red-700";
//   return (
//     <div
//       className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded relative mb-4`}
//       role="alert"
//     >
//       <span className="block sm:inline">{message}</span>
//       <span
//         onClick={onClose}
//         className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer text-xl"
//       >
//         &times;
//       </span>
//     </div>
//   );
// };

// // Dropdown options
// const SPECIALIZATIONS = [
//   { value: "Anxiety", label: "Anxiety" },
//   { value: "Depression", label: "Depression" },
//   { value: "Grief", label: "Grief" },
//   { value: "Stress", label: "Stress" },
//   { value: "Trauma", label: "Trauma" },
//   { value: "Relationship", label: "Relationship" },
//   { value: "Addiction", label: "Addiction" },
// ];
// const LANGUAGES = [
//   { value: "English", label: "English" },
//   { value: "Spanish", label: "Spanish" },
//   { value: "French", label: "French" },
//   { value: "German", label: "German" },
//   { value: "Mandarin", label: "Mandarin" },
//   { value: "Hindi", label: "Hindi" },
// ];
// const PERMISSIONS = ["ban_users", "remove_posts", "approve_therapists"];
// const BOT_TYPES = [
//   { value: "chatbot", label: "Chatbot" },
//   { value: "moderation_bot", label: "Moderation Bot" },
//   { value: "recommendation_ai", label: "Recommendation AI" },
// ];
// const feelingsOptions = [
//   "Anxiety", "Depression", "Denial", "Grief",
//   "Stress", "Loneliness", "Anger", "Fear"
// ];

// const Signup = () => {
//   const { type } = useParams();
//   const navigate = useNavigate();
//   const [notification, setNotification] = useState(null);
//   const [countries, setCountries] = useState([]);
//   const [cities, setCities] = useState([]);

//   // DOB pickers
//   const [dobYear, setDobYear] = useState("");
//   const [dobMonth, setDobMonth] = useState("");
//   const [dobDay, setDobDay] = useState("");

//   const years = useMemo(() => {
//     const curr = new Date().getFullYear() - 14;
//     const min = curr - 86; // up to 100yr span
//     const arr = [];
//     for (let y=curr; y>=min; y--) arr.push(y);
//     return arr;
//   }, []);
//   const months = ["January","February","March","April","May","June",
//                   "July","August","September","October","November","December"];
//   const days = useMemo(() => {
//     if (!dobYear||!dobMonth) return Array.from({length:31},(_,i)=>i+1);
//     return Array.from(
//       {length:new Date(dobYear, dobMonth, 0).getDate()},
//       (_,i)=>i+1
//     );
//   }, [dobYear,dobMonth]);

//   const [formData, setFormData] = useState({
//     username:"", email:"", password:"", dob:"",
//     gender:"", country:"", city:"", bio:"",
//     faith_support:false, showFeelings:false, current_feelings:[],
//     specialization_tags:[], experience_years:"",
//     license_number:"", languages_spoken:[],
//     session_duration:"", appointment_types:[],
//     availability_preference:"weekly_schedule",
//     permissions:[], bot_type:""
//   });

//   // Countries & cities
//   useEffect(()=>{
//     fetch("https://countriesnow.space/api/v0.1/countries/iso")
//       .then(r=>r.json()).then(d=>d.data&&setCountries(d.data.map(c=>c.name).sort()));
//   },[]);
//   useEffect(()=>{
//     if(!formData.country) return setCities([]);
//     fetch("https://countriesnow.space/api/v0.1/countries/cities", {
//       method:"POST",headers:{"Content-Type":"application/json"},
//       body:JSON.stringify({country:formData.country})
//     })
//       .then(r=>r.json()).then(d=>Array.isArray(d.data)&&setCities(d.data.sort()));
//   },[formData.country]);

//   // Handlers
//   const handleChange = e=>{
//     const {name,type,checked,value} = e.target;
//     setFormData(p=>({...p,[name]:type==="checkbox"?checked:value}));
//   };
//   const handleCreatable=(name,sel)=>{
//     setFormData(p=>({...p,[name]:sel?sel.map(s=>s.value):[]}));
//   };
//   const toggleList=(field,item)=>{
//     setFormData(p=>{
//       const list=p[field]||[];
//       return {...p,[field]:list.includes(item)?list.filter(i=>i!==item):[...list,item]};
//     });
//   };
//   // Compose DOB
//   useEffect(()=>{
//     if(dobYear&&dobMonth&&dobDay){
//       const mm=String(dobMonth).padStart(2,"0"),
//             dd=String(dobDay).padStart(2,"0");
//       setFormData(p=>({...p,dob:`${dobYear}-${mm}-${dd}`}));
//     }
//   },[dobYear,dobMonth,dobDay]);

//   // Submit
//   const handleSubmit=async e=>{
//     e.preventDefault();
//     if(!formData.dob){
//       setNotification({message:"Please select your DOB",type:"error"});
//       return;
//     }
//     const userData={...formData,role:type};
//     let payload={userData};
//     if(type==="therapist"){
//       payload.roleData={
//         specialization_tags:formData.specialization_tags,
//         experience_years:Number(formData.experience_years),
//         license_number:formData.license_number,
//         languages_spoken:formData.languages_spoken,
//         session_duration:Number(formData.session_duration),
//         appointment_types:formData.appointment_types,
//         availability_preference:formData.availability_preference
//       };
//     }
//     else if(type==="admin"){
//       payload.roleData={permissions:formData.permissions};
//     }
//     else if(type==="bot"){
//       payload.roleData={bot_type:formData.bot_type};
//     }
//     try{
//       const res=await fetch("https://empathaiv2-backend.onrender.com/auth/register",{
//         method:"POST",
//         headers:{"Content-Type":"application/json"},
//         body:JSON.stringify(payload)
//       });
//       if(!res.ok){
//         const err=await res.json();
//         throw new Error(err.message);
//       }
//       setNotification({message:"Signup successful!",type:"success"});
//       setTimeout(()=>navigate("/login"),2000);
//     }catch(err){
//       setNotification({message:err.message,type:"error"});
//     }
//   };

//   // Auto-dismiss
//   useEffect(()=>{
//     if(!notification) return;
//     const t=setTimeout(()=>setNotification(null),5000);
//     return()=>clearTimeout(t);
//   },[notification]);

//   const hour    = new Date().getHours(); // 0–23
//      const videoSrc =
//        hour >=  6 && hour < 18
//          ? bgVideoMorning
//          : bgVideoNight;
      
//       useEffect(() => {
//         const now = new Date();
//         // construct next 6pm today or tomorrow
//         const next6pm = new Date(now);
//         next6pm.setHours(18, 0, 0, 0);
//         if (next6pm <= now) {
//           // if it’s already past 6pm today, schedule for tomorrow
//           next6pm.setDate(next6pm.getDate() + 1);
//         }
//         const msUntil6pm = next6pm - now;
    
//         const timeoutId = setTimeout(() => {
//           // reload right at 6pm
//           window.location.reload();
//           // then set up daily interval
//           setInterval(() => window.location.reload(), 24 * 60 * 60 * 1000);
//         }, msUntil6pm);
    
//         return () => {
//           clearTimeout(timeoutId);
//         };
//       }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-2xl bg-white shadow-md rounded-md px-8 py-6">
//         <h1 className="text-4xl font-bold text-emerald-600 text-center mb-4">Sign Up</h1>
//         {notification && <NotificationPopup {...notification} onClose={()=>setNotification(null)}/>}
//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* Basic Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray font-bold">Username</label>
//               <input
//                 name="username" value={formData.username}
//                 onChange={handleChange}
//                 required className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-gray font-bold">Email</label>
//               <input
//                 name="email" type="email" value={formData.email}
//                 onChange={handleChange}
//                 required className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-gray font-bold">Password</label>
//               <input
//                 name="password" type="password" value={formData.password}
//                 onChange={handleChange}
//                 required className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-gray font-bold">Gender</label>
//               <select
//                 name="gender" value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="non-binary">Non-binary</option>
//                 <option value="prefer not to say">Prefer not to say</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray font-bold">Country</label>
//               <select
//                 name="country" value={formData.country}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Country</option>
//                 {countries.map(c=> <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray font-bold">City</label>
//               <select
//                 name="city" value={formData.city}
//                 onChange={handleChange}
//                 disabled={!cities.length}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select City</option>
//                 {cities.map(c=> <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* DOB */}
//           <div>
//             <label className="block text-gray font-bold">Date of Birth</label>
//             <div className="flex space-x-2 mt-1">
//               <select
//                 value={dobYear} onChange={e=>setDobYear(e.target.value)}
//                 required className="w-1/3 border rounded px-3 py-2"
//               >
//                 <option value="">Year</option>
//                 {years.map(y=> <option key={y} value={y}>{y}</option>)}
//               </select>
//               <select
//                 value={dobMonth} onChange={e=>setDobMonth(e.target.value)}
//                 required className="w-1/3 border rounded px-3 py-2"
//               >
//                 <option value="">Month</option>
//                 {months.map((m,i)=> <option key={i} value={i+1}>{m}</option>)}
//               </select>
//               <select
//                 value={dobDay} onChange={e=>setDobDay(e.target.value)}
//                 required className="w-1/3 border rounded px-3 py-2"
//               >
//                 <option value="">Day</option>
//                 {days.map(d=> <option key={d} value={d}>{d}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Bio */}
//           <div>
//             <label className="block text-gray font-bold">
//               Tell us a bit about yourself so that we can curate better content for you
//             </label>
//             <textarea
//               name="bio" rows={3} value={formData.bio}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Faith & Feelings */}
//           <div className="flex items-center">
//             <input
//               name="faith_support" type="checkbox"
//               checked={formData.faith_support}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label className="text-gray font-bold">
//               Would you like to explore faith / spiritual ways to help you better?
//             </label>
//           </div>
//           <div className="flex items-center">
//             <input
//               name="showFeelings" type="checkbox"
//               checked={formData.showFeelings}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label className="text-gray font-bold">
//               Would you like to tell us what you are currently going through?
//             </label>
//           </div>
//           {formData.showFeelings && (
//             <div className="grid grid-cols-2 gap-2 border rounded p-3">
//               {feelingsOptions.map(f=> (
//                 <label key={f} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={formData.current_feelings.includes(f)}
//                     onChange={()=>toggleList('current_feelings',f)}
//                     className="mr-2"
//                   />
//                   {f}
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* Role-specific */}
//           {type==="therapist" && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold">Therapist Details</h2>
//               <div>
//                 <label className="block text-gray font-bold">Specialisation Tags</label>
//                 <CreatableSelect
//                   isMulti
//                   options={SPECIALIZATIONS}
//                   onChange={sel=>handleCreatable('specialization_tags',sel)}
//                   value={SPECIALIZATIONS.filter(o=>formData.specialization_tags.includes(o.value))}
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray font-bold">Experience (Years)</label>
//                 <input
//                   name="experience_years" type="number" min="0"
//                   value={formData.experience_years}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray font-bold">License Number</label>
//                 <input
//                   name="license_number"
//                   value={formData.license_number}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray font-bold">Languages Spoken</label>
//                 <CreatableSelect
//                   isMulti
//                   options={LANGUAGES}
//                   onChange={sel=>handleCreatable('languages_spoken',sel)}
//                   value={LANGUAGES.filter(o=>formData.languages_spoken.includes(o.value))}
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray font-bold">Session Duration (mins)</label>
//                 <input
//                   name="session_duration" type="number" min="15"
//                   value={formData.session_duration}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray font-bold">Appointment Types</label>
//                 <CreatableSelect
//                   isMulti
//                   options={[{value:'text',label:'text'},{value:'voice',label:'voice'},{value:'video',label:'video'}]}
//                   onChange={sel=>handleCreatable('appointment_types',sel)}
//                   value={[{value:'text',label:'text'},{value:'voice',label:'voice'},{value:'video',label:'video'}]
//                     .filter(o=>formData.appointment_types.includes(o.value))}
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray font-bold">Availability Preference</label>
//                 <select
//                   name="availability_preference"
//                   value={formData.availability_preference}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2"
//                 >
//                   <option value="weekly_schedule">Weekly Schedule</option>
//                   <option value="custom_dates">Custom Dates</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {type==="admin" && (
//             <div>
//               <h2 className="text-xl font-semibold">Admin Permissions</h2>
//               <div className="grid grid-cols-2 gap-2">
//                 {PERMISSIONS.map(p=>(
//                   <label key={p} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.permissions.includes(p)}
//                       onChange={()=>toggleList('permissions',p)}
//                       className="mr-2"
//                     />
//                     {p.replace(/_/g,' ')}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {type==="bot" && (
//             <div>
//               <h2 className="text-xl font-semibold">Bot Settings</h2>
//               <label className="block text-gray font-bold">Bot Type</label>
//               <select
//                 name="bot_type"
//                 value={formData.bot_type}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Bot Type</option>
//                 {BOT_TYPES.map(b=>(
//                   <option key={b.value} value={b.value}>{b.label}</option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-gray font-semibold py-2 px-4 rounded"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// src/pages/Signup.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Lottie from "lottie-react";
// import signupAnim from "/src/signupAnim.json?url";
import signupAnim from '/src/signupAnim.json'   // adjust path to wherever your JSON lives

<Lottie animationData={signupAnim} />

// — Notification “toast” at top of form —
const NotificationPopup = ({ message, type, onClose }) => {
  const bg = type === "success" ? "bg-green-100" : "bg-red-100";
  const border = type === "success" ? "border-green-400" : "border-red-400";
  const text = type === "success" ? "text-green-700" : "text-red-700";
  return (
    <div
      className={`${bg} ${border} ${text} border px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        onClick={onClose}
        className="absolute top-0 right-0 px-4 py-3 cursor-pointer text-xl"
      >
        &times;
      </span>
    </div>
  );
};

// — Dropdown/checkbox options —
const SPECIALIZATIONS = [
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
  { value: "Grief", label: "Grief" },
  { value: "Stress", label: "Stress" },
  { value: "Trauma", label: "Trauma" },
  { value: "Relationship", label: "Relationship" },
  { value: "Addiction", label: "Addiction" },
];
const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Hindi", label: "Hindi" },
];
const PERMISSIONS = ["ban_users", "remove_posts", "approve_therapists"];
const BOT_TYPES = [
  { value: "chatbot", label: "Chatbot" },
  { value: "moderation_bot", label: "Moderation Bot" },
  { value: "recommendation_ai", label: "Recommendation AI" },
];
const FEELINGS = [
  "Anxiety", "Depression", "Denial", "Grief",
  "Stress", "Loneliness", "Anger", "Fear"
];

export default function Signup() {
  const { type } = useParams();           // role: user | therapist | admin | bot
  const navigate = useNavigate();

  // — Notification state —
  const [notification, setNotification] = useState(null);

  // — Country / City dropdown —
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // — DOB pickers —
  const [dobYear, setDobYear]   = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay]     = useState("");

  // — build arrays for years, months, days —
  const years = useMemo(() => {
    const now = new Date().getFullYear() - 14;
    const min = now - 86;
    const arr = [];
    for (let y = now; y >= min; y--) arr.push(y);
    return arr;
  }, []);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const days = useMemo(() => {
    if (!dobYear || !dobMonth) return Array.from({ length: 31 }, (_, i) => i + 1);
    return Array.from(
      { length: new Date(dobYear, dobMonth, 0).getDate() },
      (_, i) => i + 1
    );
  }, [dobYear, dobMonth]);

  // — full form state —
  const [formData, setFormData] = useState({
    username: "", email: "", password: "",
    dob: "", gender: "", country: "", city: "", bio: "",
    faith_support: false, showFeelings: false,
    current_feelings: [],
    // therapist fields
    specialization_tags: [], experience_years: "",
    license_number: "", languages_spoken: [],
    session_duration: "", appointment_types: [],
    availability_preference: "weekly_schedule",
    // admin / bot
    permissions: [], bot_type: ""
  });

  // — load country list once —
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then(r => r.json())
      .then(d => d.data && setCountries(d.data.map(c => c.name).sort()));
  }, []);

  // — load cities whenever country changes —
  useEffect(() => {
    if (!formData.country) return setCities([]);
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: formData.country })
    })
      .then(r => r.json())
      .then(d => Array.isArray(d.data) && setCities(d.data.sort()));
  }, [formData.country]);

  // — generic onChange handler —
  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setFormData(p => ({
      ...p,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // — for creatable multi‐selects —
  const handleCreatable = (field, sel) => {
    setFormData(p => ({
      ...p,
      [field]: sel ? sel.map(s => s.value) : []
    }));
  };

  // — toggle item in a list field (feelings / permissions) —
  const toggleList = (field, item) => {
    setFormData(p => {
      const list = p[field] || [];
      return {
        ...p,
        [field]: list.includes(item)
          ? list.filter(i => i !== item)
          : [...list, item]
      };
    });
  };

  // — assemble dob ISO once year/month/day are set —
  useEffect(() => {
    if (dobYear && dobMonth && dobDay) {
      const mm = String(dobMonth).padStart(2, "0");
      const dd = String(dobDay).padStart(2, "0");
      setFormData(p => ({ ...p, dob: `${dobYear}-${mm}-${dd}` }));
    }
  }, [dobYear, dobMonth, dobDay]);

  // — submit handler —
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.dob) {
      setNotification({ message: "Please select your DOB", type: "error" });
      return;
    }

    // build payload
    const userData = { ...formData, role: type };
    const payload = { userData };
    if (type === "therapist") {
      payload.roleData = {
        specialization_tags: formData.specialization_tags,
        experience_years: Number(formData.experience_years),
        license_number: formData.license_number,
        languages_spoken: formData.languages_spoken,
        session_duration: Number(formData.session_duration),
        appointment_types: formData.appointment_types,
        availability_preference: formData.availability_preference
      };
    } else if (type === "admin") {
      payload.roleData = { permissions: formData.permissions };
    } else if (type === "bot") {
      payload.roleData = { bot_type: formData.bot_type };
    }

    try {
      const res = await fetch("https://empathaiv2-backend.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setNotification({ message: "Signup successful! Redirecting…", type: "success" });
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    }
  };

  // — auto‐dismiss notification after 5s —
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(t);
  }, [notification]);

  return (
    <div
  className="min-h-screen grid grid-cols-1 md:grid-cols-2"   style={{
    backgroundImage: "url('/assets/wallpaperSignup.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
      
      {/* ── LEFT PANEL ── */}
      <div className="flex flex-col items-center justify-center px-12 text-black/90">
        <h2 className="text-4xl font-bold mb-4">Join EmpathAI</h2>
        <p className="text-center text-2xl italic mb-8">
          A digital home where you can share your story, find support, and heal together.
        </p>
        <div className="w-64 h-64 mb-8">
          <Lottie animationData={signupAnim} loop autoplay />
        </div>
        <ul className="space-y-3 text-lg">
          <li>🍃 Connect with caring communities</li>
          <li>✍️ Write in your personal journal</li>
          <li>🗣️ Chat one-on-one with our AI listener</li>
          <li>🤝 Join grief & wellness support groups</li>
        </ul>
      </div>


  
      <div className="flex items-center justify-center p-8
                  bg-white/10">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            Sign Up
          </h1>
          {notification && (
            <NotificationPopup
              {...notification}
              onClose={() => setNotification(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username / Email / Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-black rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-black rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-black rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2"
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
            </div>

            {/* Country / City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-black rounded px-3 py-2"
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!cities.length}
                  className="w-full border border-black rounded px-3 py-2"
                >
                  <option value="">Select City</option>
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-semibold mb-1">Date of Birth</label>
              <div className="flex gap-2">
                <select
                  value={dobYear}
                  onChange={e => setDobYear(e.target.value)}
                  required
                  className="flex-1 border border-black rounded px-3 py-2"
                >
                  <option value="">Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={dobMonth}
                  onChange={e => setDobMonth(e.target.value)}
                  required
                  className="flex-1 border border-black rounded px-3 py-2"
                >
                  <option value="">Month</option>
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={dobDay}
                  onChange={e => setDobDay(e.target.value)}
                  required
                  className="flex-1 border border-black rounded px-3 py-2"
                >
                  <option value="">Day</option>
                  {days.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-semibold mb-1">
                Tell us about yourself
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            {/* Faith & Feelings */}
            <div className="flex items-center space-x-2">
              <input
                name="faith_support"
                type="checkbox"
                checked={formData.faith_support}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="font-semibold">
                Explore faith / spiritual support?
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                name="showFeelings"
                type="checkbox"
                checked={formData.showFeelings}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="font-semibold">
                Share what you’re currently feeling?
              </label>
            </div>
            {formData.showFeelings && (
              <div className="grid grid-cols-2 gap-2 border border-black rounded p-3">
                {FEELINGS.map(f => (
                  <label key={f} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.current_feelings.includes(f)}
                      onChange={() => toggleList("current_feelings", f)}
                      className="mr-2"
                    />
                    {f}
                  </label>
                ))}
              </div>
            )}

            {/* Therapist‐only section */}
            {type === "therapist" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Therapist Details</h2>
                <div>
                  <label className="block font-semibold mb-1">
                    Specialization Tags
                  </label>
                  <CreatableSelect
                    isMulti
                    options={SPECIALIZATIONS}
                    onChange={sel => handleCreatable("specialization_tags", sel)}
                    value={SPECIALIZATIONS.filter(o =>
                      formData.specialization_tags.includes(o.value)
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Experience (yrs)
                    </label>
                    <input
                      name="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={handleChange}
                      className="w-full border border-black rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      License Number
                    </label>
                    <input
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      className="w-full border border-black rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Languages Spoken
                  </label>
                  <CreatableSelect
                    isMulti
                    options={LANGUAGES}
                    onChange={sel => handleCreatable("languages_spoken", sel)}
                    value={LANGUAGES.filter(o =>
                      formData.languages_spoken.includes(o.value)
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Session Duration (mins)
                    </label>
                    <input
                      name="session_duration"
                      type="number"
                      min="15"
                      value={formData.session_duration}
                      onChange={handleChange}
                      className="w-full border border-black rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Appointment Types
                    </label>
                    <CreatableSelect
                      isMulti
                      options={[
                        { value: "text", label: "text" },
                        { value: "voice", label: "voice" },
                        { value: "video", label: "video" }
                      ]}
                      onChange={sel => handleCreatable("appointment_types", sel)}
                      value={[
                        { value: "text", label: "text" },
                        { value: "voice", label: "voice" },
                        { value: "video", label: "video" }
                      ].filter(o =>
                        formData.appointment_types.includes(o.value)
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Availability Preference
                  </label>
                  <select
                    name="availability_preference"
                    value={formData.availability_preference}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="weekly_schedule">Weekly Schedule</option>
                    <option value="custom_dates">Custom Dates</option>
                  </select>
                </div>
              </div>
            )}

            {/* Admin / Bot Sections */}
            {type === "admin" && (
              <div>
                <h2 className="text-xl font-semibold">Admin Permissions</h2>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map(p => (
                    <label key={p} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(p)}
                        onChange={() => toggleList("permissions", p)}
                        className="mr-2"
                      />
                      {p.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {type === "bot" && (
              <div>
                <h2 className="text-xl font-semibold">Bot Type</h2>
                <select
                  name="bot_type"
                  value={formData.bot_type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Bot Type</option>
                  {BOT_TYPES.map(b => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
        </div>
      </div>
  );
}
