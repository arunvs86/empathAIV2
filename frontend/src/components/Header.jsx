
// import React, { useState, useEffect, useRef } from "react";
// import { NavLink, Link, useNavigate } from "react-router-dom";
// import { ChevronDown, MessageCircle, Bell, LogOut } from "lucide-react";
// import socket from "../services/socket";
// import { useUnreadChats } from "../contexts/UnreadChatsContext";

// export default function Header() {
//   const navigate = useNavigate();
//   const [openUser, setOpenUser] = useState(false);
//   const [openMore, setOpenMore] = useState(false);
//   const userRef = useRef(null);
//   const moreRef = useRef(null);

//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const avatarUrl = currentUser.profile_picture || "/assets/avatar.png";

//   // context for unread badges
//   const { unreadChats, setUnreadChats } = useUnreadChats();

//   // outside-click handlers
//   useEffect(() => {
//     const handler = e => {
//       if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
//       if (moreRef.current && !moreRef.current.contains(e.target)) setOpenMore(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // listen for newMessage events
//   useEffect(() => {
//     socket.on("newMessage", ({ chatId, message }) => {
//       const senderId = message.senderId;
//       const me       = currentUser.id;
//       if (senderId !== me && !unreadChats[chatId]) {
//         const next = { ...unreadChats, [chatId]: true };
//         setUnreadChats(next);
//         localStorage.setItem("unreadChats", JSON.stringify(next));
//       }
//     });
//     return () => socket.off("newMessage");
//   }, [unreadChats, setUnreadChats, currentUser.id]);

//   const totalUnread = Object.keys(unreadChats).length;

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const PRIMARY_TABS = [
//     { label: "All Posts", to: "/" },
//     { label: "Communities", to: "/communities" },
//     { label: "Faith-Based", to: "/faith" },
//     { label: "My Journals", to: `/profile/${currentUser.id}/journals` },
//   ];
//   const MORE_TABS = [
//     { label: "Events Nearby", to: "/feed/events" },
//     { label: "Plant a Sapling", to: "/feed/sapling" },
//     { label: "Wellness Tips", to: "/feed/wellness" },
//     { label: "Mindful Meditation", to: "/feed/meditation" },
//   ];

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-md z-30">
//       <div className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
//         <h1
//           className="text-emerald-600 font-bold text-2xl cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           EmpathAI
//         </h1>

//         <nav className="flex-1 flex justify-center space-x-8">
//           {PRIMARY_TABS.map(tab => (
//             <NavLink
//               key={tab.to}
//               to={tab.to}
//               className={({ isActive }) =>
//                 `text-sm font-medium ${
//                   isActive ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
//                 }`
//               }
//             >
//               {tab.label}
//             </NavLink>
//           ))}

//           <div className="relative" ref={moreRef}>
//             <button
//               onClick={() => setOpenMore(o => !o)}
//               className="flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600"
//             >
//               More <ChevronDown className="w-4 h-4 ml-1" />
//             </button>
//             {openMore && (
//               <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 shadow-lg rounded-md py-1">
//                 {MORE_TABS.map(tab => (
//                   <NavLink
//                     key={tab.to}
//                     to={tab.to}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setOpenMore(false)}
//                   >
//                     {tab.label}
//                   </NavLink>
//                 ))}
//               </div>
//             )}
//           </div>
//         </nav>

//         <div className="flex items-center space-x-4">
//           <Link to="/chats" className="relative">
//             <MessageCircle className="w-6 h-6 text-gray-700 hover:text-emerald-600" />
//             {totalUnread > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
//                 {totalUnread}
//               </span>
//             )}
//           </Link>

//           <Link to="/notifications" className="relative">
//             <Bell className="w-6 h-6 text-gray-700 hover:text-emerald-600" />
//           </Link>

//           <div className="relative flex-shrink-0" ref={userRef}>
//             <button onClick={() => setOpenUser(u => !u)} className="flex items-center">
//               <span
//                 onClick={() => navigate(`/profile/${currentUser.id}`)}
//                 className="text-gray-700 font-medium text-sm cursor-pointer"
//               >
//                 Hello, {currentUser.username}
//               </span>
//               <img
//                 src={avatarUrl}
//                 alt="Avatar"
//                 className="w-8 h-8 rounded-full object-cover ml-2"
//                 onClick={() => navigate(`/profile/${currentUser.id}`)}
//               />
//               <ChevronDown className="w-4 h-4 ml-1 text-gray-600" />
//             </button>
//             {openUser && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md py-1">
//                 <Link
//                   to="/chats"
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   onClick={() => setOpenUser(false)}
//                 >
//                   <MessageCircle className="w-4 h-4 mr-2" />
//                   Messages
//                 </Link>
//                 <Link
//                   to="/notifications"
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   onClick={() => setOpenUser(false)}
//                 >
//                   <Bell className="w-4 h-4 mr-2" />
//                   Notifications
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ChevronDown, MessageCircle, Bell, LogOut } from "lucide-react";
import socket from "../services/socket";
import { useUnreadChats } from "../contexts/UnreadChatsContext";

export default function Header() {
  const navigate = useNavigate();
  const [openUser, setOpenUser] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const userRef = useRef(null);
  const moreRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarUrl = currentUser.profile_picture || "/assets/avatar.png";

  const { unreadChats, setUnreadChats } = useUnreadChats();

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setOpenMore(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    socket.on("newMessage", ({ chatId, message }) => {
      const me = currentUser.id;
      if (message.senderId !== me && !unreadChats[chatId]) {
        const next = { ...unreadChats, [chatId]: true };
        setUnreadChats(next);
        localStorage.setItem("unreadChats", JSON.stringify(next));
      }
    });
    return () => socket.off("newMessage");
  }, [unreadChats, setUnreadChats, currentUser.id]);

  const totalUnread = Object.keys(unreadChats).length;
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const PRIMARY_TABS = [
    { label: "All Posts", to: "/" },
    { label: "Communities", to: "/communities" },
    { label: "Faith-Based", to: "/faith" },
    { label: "My Journals", to: `/profile/${currentUser.id}/journals` },
  ];
  const MORE_TABS = [
    { label: "Events Nearby", to: "/feed/events" },
    { label: "Plant a Sapling", to: "/feed/sapling" },
    { label: "Wellness Tips", to: "/feed/wellness" },
    { label: "Mindful Meditation", to: "/feed/meditation" },
  ];

  const goProfile = () => navigate(`/profile/${currentUser.id}`);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg shadow-lg">
      <div className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <h1
          className="font-bold text-2xl cursor-pointer text-white"
          onClick={() => navigate("/")}
        >
          EmpathAI
        </h1>

        <nav className="flex-1 flex justify-center space-x-8">
          {PRIMARY_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold"
                  : "text-gray-200 hover:text-white transition"
              }
            >
              {tab.label}
            </NavLink>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setOpenMore((o) => !o)}
              className="flex items-center text-gray-200 hover:text-white"
            >
              More <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openMore && (
              <div className="absolute top-full left-0 mt-1 bg-white/90 backdrop-blur-sm rounded-md shadow-lg z-60">
                {MORE_TABS.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setOpenMore(false)}
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/chats" className="relative text-gray-200 hover:text-white">
            <MessageCircle className="w-6 h-6" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                {totalUnread}
              </span>
            )}
          </Link>
          <Link to="/notifications" className="text-gray-200 hover:text-white">
            <Bell className="w-6 h-6" />
          </Link>

          <div className="relative flex-shrink-0" ref={userRef}>
            <button
              onClick={() => setOpenUser((u) => !u)}
              className="flex items-center text-gray-200 hover:text-white"
            >
              <span className="text-sm cursor-pointer" onClick={goProfile}>   
                Hello, {currentUser.username}
              </span>
              <img
                src={avatarUrl}
                onClick={goProfile}
                alt="Avatar"
                className="w-8 h-8 rounded-full ml-2"
              />
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openUser && (
              <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm rounded-md shadow-lg py-1 z-60">
                <Link
                  to="/chats"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setOpenUser(false)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setOpenUser(false)}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
