// // src/components/LeftSidebar.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createChat } from "../services/chatApi";

// export default function LeftSidebar() {
//   const [activeSection, setActiveSection] = useState(null);
//   const navigate = useNavigate();

//   const toggleSection = (section) =>
//     setActiveSection(activeSection === section ? null : section);

//   // Navigate to your Letters page
//   const handleLetters = () => {
//     navigate("/letters");
//   };

//   // Start or open a chat with the bot
//   const handleBotChat = async () => {
//     const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
//     if (!currentUser.id) return alert("Please log in.");
//     if (currentUser.id === botId) return alert("Bot cannot message itself.");
//     try {
//       const chat = await createChat(botId);
//       navigate(`/chats/${chat._id}`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to open bot chat.");
//     }
//   };

//   return (
//     <aside className="w-full h-full p-4">
//       <div className="bg-white shadow-md rounded p-4 space-y-6">
//         {/* Search Bar */}
//         <div>
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           />
//         </div>

//         {/* Favourites Accordion */}
//         <div className="bg-white rounded shadow transition-all duration-200">
//           <button
//             onClick={() => toggleSection("favourites")}
//             className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
//           >
//             <h3 className="text-lg font-semibold text-gray-800">
//               Favourites
//             </h3>
//           </button>
//           {activeSection === "favourites" && (
//             <div className="p-4">
//               <ul className="space-y-2 text-emerald-600 text-sm">
//                 <li>Favourite 1</li>
//                 <li>Favourite 2</li>
//                 <li>Favourite 3</li>
//                 <li>Favourite 4</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Recently Viewed Accordion */}
//         <div className="bg-white rounded shadow transition-all duration-200">
//           <button
//             onClick={() => toggleSection("recentlyViewed")}
//             className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 focus:outline-none hover:bg-gray-100"
//           >
//             <h3 className="text-lg font-semibold text-gray-800">
//               Recently Viewed
//             </h3>
//           </button>
//           {activeSection === "recentlyViewed" && (
//             <div className="p-4">
//               <ul className="space-y-2 text-emerald-600 text-sm">
//                 <li>Item 1</li>
//                 <li>Item 2</li>
//                 <li>Item 3</li>
//                 <li>Item 4</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* My Letters Link */}
//         <button
//           onClick={handleLetters}
//           className="w-full text-left px-4 py-3 bg-gray-50 rounded shadow hover:bg-gray-100 focus:outline-none"
//         >
//           <h3 className="text-lg font-semibold text-gray-800">My Letters</h3>
//         </button>

//         {/* EmpathAI Bot Chat */}
//         <button
//           onClick={handleBotChat}
//           className="w-full text-left px-4 py-3 bg-gray-50 rounded shadow hover:bg-gray-100 focus:outline-none"
//         >
//           <h3 className="text-lg font-semibold text-gray-800">
//             EmpathAI Bot
//           </h3>
//         </button>
//       </div>
//     </aside>
//   );
// }

// src/components/LeftSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createChat } from "../services/chatApi";

export default function LeftSidebar() {
  const [activeSection, setActiveSection] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  // Load favorites & recents once on mount
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("myFavorites") || "[]");
    setFavorites(favs.slice(0, 4));

    const recents = JSON.parse(
      localStorage.getItem("recentlyViewedCommunities") || "[]"
    );
    setRecentlyViewed(recents.slice(0, 4));
  }, []);

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  const handleLetters = () => navigate("/letters");

  const handleBotChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const botId = "c7291129-8ed5-40d6-a504-b96f957ceb88";
    if (!currentUser.id) return alert("Please log in.");
    if (currentUser.id === botId) return alert("Bot cannot message itself.");
    try {
      const chat = await createChat(botId);
      navigate(`/chats/${chat._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to open bot chat.");
    }
  };

  return (
    <aside className="w-full h-full p-4">
      <div className="bg-white shadow-md rounded p-4 space-y-6">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Favourites */}
        <div className="bg-white rounded shadow transition-all">
          <button
            onClick={() => toggleSection("favourites")}
            className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">Favourites</h3>
          </button>
          {activeSection === "favourites" && (
            <div className="p-4">
              {favorites.length > 0 ? (
                <ul className="space-y-2 text-emerald-600 text-sm">
                  {favorites.map((f) => (
                    <li key={`${f.type}-${f.id}`}>
                      <button
                        onClick={() => navigate(f.link)}
                        className="w-full text-left"
                      >
                        {f.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No favourites yet</p>
              )}
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="bg-white rounded shadow transition-all">
          <button
            onClick={() => toggleSection("recentlyViewed")}
            className="w-full text-left px-4 py-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Recently Viewed
            </h3>
          </button>
          {activeSection === "recentlyViewed" && (
            <div className="p-4">
              {recentlyViewed.length > 0 ? (
                <ul className="space-y-2 text-emerald-600 text-sm">
                  {recentlyViewed.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => navigate(c.link)}
                        className="w-full text-left"
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">None so far</p>
              )}
            </div>
          )}
        </div>

        {/* My Letters */}
        <button
          onClick={handleLetters}
          className="w-full text-left px-4 py-3 bg-gray-50 rounded shadow hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800">My Letters</h3>
        </button>

        {/* EmpathAI Bot */}
        <button
          onClick={handleBotChat}
          className="w-full text-left px-4 py-3 bg-gray-50 rounded shadow hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            EmpathAI Bot
          </h3>
        </button>
      </div>
    </aside>
  );
}
