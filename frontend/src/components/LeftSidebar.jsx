// // src/components/LeftSidebar.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createChat } from "../services/chatApi";

// export default function LeftSidebar() {
//   const [activeSection, setActiveSection] = useState(null);
//   const [favorites, setFavorites] = useState([]);
//   const [recentlyViewed, setRecentlyViewed] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setFavorites(JSON.parse(localStorage.getItem("myFavorites") || "[]").slice(0, 4));
//     setRecentlyViewed(
//       JSON.parse(localStorage.getItem("recentlyViewedCommunities") || "[]").slice(0, 4)
//     );
//   }, []);

//   const toggleSection = (section) =>
//     setActiveSection(activeSection === section ? null : section);

//   const handleLetters = () => navigate("/letters");
//   const handleBotChat = async () => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
//     if (!user.id) return alert("Please log in.");
//     if (user.id === botId) return alert("Bot cannot message itself.");
//     try {
//       const chat = await createChat(botId);
//       navigate(`/chats/${chat._id}`);
//     } catch {
//       alert("Failed to open bot chat.");
//     }
//   };

//   return (
//     <aside className="w-full h-full p-4">
//       {/* Use a flex column with gap for consistent spacing */}
//       <div className="flex flex-col gap-4">
//         {/* Search */}
        
//         {/* Favourites */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => toggleSection("favourites")}
//             className="w-full text-left px-4 py-3 bg-white/40 rounded-lg hover:bg-white/50 transition"
//           >
//             <span className="font-semibold">Favourites</span>
//           </button>
//           {activeSection === "favourites" && favorites.length > 0 && (
//             <ul className="ml-4 space-y-1 text-white/90 text-sm">
//               {favorites.map((f) => (
//                 <li key={f.id}>
//                   <button onClick={() => navigate(f.link)} className="hover:underline">
//                     {f.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Recently Viewed */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={() => toggleSection("recentlyViewed")}
//             className="w-full text-left px-4 py-3 bg-white/40 rounded-lg hover:bg-white/50 transition"
//           >
//             <span className="font-semibold">Recently Viewed</span>
//           </button>
//           {activeSection === "recentlyViewed" && recentlyViewed.length > 0 && (
//             <ul className="ml-4 space-y-1 text-white/90 text-sm">
//               {recentlyViewed.map((c) => (
//                 <li key={c.id}>
//                   <button onClick={() => navigate(c.link)} className="hover:underline">
//                     {c.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* My Letters */}
//         <button
//           onClick={handleLetters}
//           className="w-full text-left px-4 py-3 bg-white/40 rounded-lg hover:bg-white/50 transition"
//         >
//           <span className="font-semibold">My Letters</span>
//         </button>

//         {/* EmpathAI Bot */}
//         <button
//           onClick={handleBotChat}
//           className="w-full text-left px-4 py-3 bg-white/40 rounded-lg hover:bg-white/50 transition"
//         >
//           <span className="font-semibold">EmpathAI Bot</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// src/components/LeftSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, FileText, MessageSquare } from "lucide-react";
import { createChat } from "../services/chatApi";

export default function LeftSidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(
      JSON.parse(localStorage.getItem("myFavorites") || "[]").slice(0, 4)
    );
    setRecentlyViewed(
      JSON.parse(
        localStorage.getItem("recentlyViewedCommunities") || "[]"
      ).slice(0, 4)
    );
  }, []);

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  const handleLetters = () => navigate("/letters");
  const handleBotChat = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
    if (!user.id) return alert("Please log in.");
    if (user.id === botId) return alert("Bot cannot message itself.");
    try {
      const chat = await createChat(botId);
      navigate(`/chats/${chat._id}`);
    } catch {
      alert("Failed to open bot chat.");
    }
  };

  // Styles for card-style buttons
  const cardClass =
    "flex items-center flex-shrink-0 gap-2 px-3 py-2 bg-white/30 hover:bg-white/40 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200";
  const iconClass = "w-5 h-5 text-white flex-shrink-0";
  const labelClass = "text-white font-semibold text-sm whitespace-nowrap";

  return (
    <aside className="w-full h-full p-4">
      <div className="flex flex-col gap-3">
        {/* Favourites */}
        <div>
          <button
            onClick={() => toggleSection("favourites")}
            className={cardClass}
          >
            <Star className={iconClass} />
            <span className={labelClass}>Favourites</span>
          </button>
          {activeSection === "favourites" && favorites.length > 0 && (
            <ul className="ml-8 space-y-1 text-white/90 text-sm">
              {favorites.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => navigate(f.link)}
                    className="hover:underline"
                  >
                    {f.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recently Viewed */}
        <div>
          <button
            onClick={() => toggleSection("recentlyViewed")}
            className={cardClass}
          >
            <Clock className={iconClass} />
            <span className={labelClass}>Recently Viewed</span>
          </button>
          {activeSection === "recentlyViewed" && recentlyViewed.length > 0 && (
            <ul className="ml-8 space-y-1 text-white/90 text-sm">
              {recentlyViewed.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigate(c.link)}
                    className="hover:underline"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* My Letters */}
        <button onClick={handleLetters} className={cardClass}>
          <FileText className={iconClass} />
          <span className={labelClass}>My Letters</span>
        </button>

        {/* EmpathAI Bot */}
        <button onClick={handleBotChat} className={cardClass}>
          <MessageSquare className={iconClass} />
          <span className={labelClass}>EmpathAI Bot</span>
        </button>
      </div>
    </aside>
  );
}