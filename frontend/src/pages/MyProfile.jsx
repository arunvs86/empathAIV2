// // pages/MyProfile.jsx
// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate, useParams } from "react-router-dom";
// import ProfileHeader from "../components/ProfileHeader";
// import ProfileEditModal from "../components/ProfileEditModal";

// export default function MyProfile() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({ posts:0, journals:0, communities:0, habits:0 });
//   const [showEdit, setShowEdit] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     async function fetchStats() {
//       try {
//         const [pRes, jRes, cRes/*, hRes*/] = await Promise.all([
//           fetch(`https://empathaiv2-backend.onrender.com/posts/user/${userId}`, { headers:{Authorization:`Bearer ${token}`}}),
//           fetch(`https://empathaiv2-backend.onrender.com/journals?userId=${userId}`, { headers:{Authorization:`Bearer ${token}`}}),
//           fetch(`https://empathaiv2-backend.onrender.com/users/${userId}/communities`, { headers:{Authorization:`Bearer ${token}`}}),
//           // fetch habits when ready
//         ]);
//         const [posts, journals, communities/*, habits*/] = await Promise.all([
//           pRes.json(), jRes.json(), cRes.json() /*, hRes.json()*/
//         ]);
       
//         setStats({
//           posts: Array.isArray(posts) ? posts.length : 0,
//           journals: Array.isArray(journals) ? journals.length : 0,
//           communities: Array.isArray(communities) ? communities.length : 0,
//           habits: 0,
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     fetchStats();
//   }, [userId]);

//   // build nav items once
//   const tabs = [
//     { label:"Posts",      to:"posts" },
//     { label:"Journals",   to:"journals" },
//     { label:"Communities",to:"communities" },
//     { label:"Habits",     to:"habits" },
//   ];

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <ProfileHeader stats={stats}
//       onEdit={() => setShowEdit(true)}  
//        />
//       <nav className="mb-8 flex space-x-6 border-b border-gray-200 pb-2">
//         {tabs.map(({ label, to }) => (
//           <button
//             key={to}
//             onClick={() => navigate(to)}
//             className="text-white-600 hover:text-emerald-600 font-medium pb-1 border-b-2 border-transparent hover:border-emerald-600 transition"
//           >
//             {label}
//           </button>
//         ))}
//       </nav>

//       {/* This renders whichever child route you’re on */}
//       <Outlet />

//       {showEdit && (
//         <ProfileEditModal
//           userId={userId}
//           onClose={() => setShowEdit(false)}
//           onSaved={() => {
//             setShowEdit(false);
//             window.location.reload();          // or re-fetch user
//           }}
//         />
//       )}

//     </div>
//   );
// }


// pages/MyProfile.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileEditModal from '../components/ProfileEditModal';

export default function MyProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, journals: 0, communities: 0, habits: 0 });
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    async function fetchStats() {
      try {
        const [pRes, jRes, cRes] = await Promise.all([
          fetch(`https://empathaiv2-backend.onrender.com/posts/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`https://empathaiv2-backend.onrender.com/journals?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`https://empathaiv2-backend.onrender.com/users/${userId}/communities`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [posts, journals, communities] = await Promise.all([pRes.json(), jRes.json(), cRes.json()]);

        setStats({
          posts: Array.isArray(posts) ? posts.length : 0,
          journals: Array.isArray(journals) ? journals.length : 0,
          communities: Array.isArray(communities) ? communities.length : 0,
          habits: 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [userId]);

  const tabs = [
    { label: 'Posts', to: 'posts' },
    { label: 'Journals', to: 'journals' },
    { label: 'Communities', to: 'communities' },
    { label: 'Habits', to: 'habits' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ProfileHeader stats={stats} onEdit={() => setShowEdit(true)} />

      <nav className="mb-8 flex space-x-6 border-b border-gray-200 pb-2">
        {tabs.map(({ label, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="text-white-600 hover:text-emerald-600 font-medium pb-1 border-b-2 border-transparent hover:border-emerald-600 transition"
          >
            {label}
          </button>
        ))}
      </nav>

      <Outlet />

      {showEdit && (
        <ProfileEditModal
          userId={userId}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}