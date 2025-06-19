// import React from "react";
// import { useNavigate } from "react-router-dom";


// function ChatCard({ chat }) {
//   const navigate = useNavigate();

//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const currentUserId = currentUser.id;

//   // Filter out the current user to get the "other" participant.
//   // We assume chat.participants is already enriched to be an array of objects
//   // like { id, username, profile_picture }
//   const otherParticipant =
//     chat.participants.find((p) => p.id !== currentUserId) || { username: "EmpathAIBot" };

//   return (
//     <div
//       onClick={() => navigate(`/chats/${chat._id}`)}
//       className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow w-full"
//     >
//       <div className="flex items-center space-x-3">
//         {/* Avatar for the other participant */}
//         <img
//           src={otherParticipant.profile_picture || "/assets/avatar.png"}
//           alt="Avatar"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div>
//           {/* Make sure we render a string (username) not the object */}
//           <h3 className="text-sm font-bold text-gray-800">
//             {otherParticipant.username}
//           </h3>
//           {/* Render last message if it is a string */}
//           {typeof chat.lastMessage === "string" && chat.lastMessage && (
//             <p className="text-xs text-gray-600 truncate max-w-xs">
//               {chat.lastMessage}
//             </p>
//           )}
//         </div>
//       </div>
//       {chat.lastMessageAt && (
//         <p className="text-xs text-gray-500 mt-2">
//           {new Date(chat.lastMessageAt).toLocaleString()}
//         </p>
//       )}
//     </div>
//   );
// }

// // export default ChatCard;

// import React from "react";
// import { useNavigate } from "react-router-dom";

// function ChatCard({ chat }) {
//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const currentUserId = currentUser.id;

//   // grab the “other” participant
//   const otherParticipant =
//     chat.participants.find((p) => p.id !== currentUserId) ||
//     { username: "EmpathAIBot" };

//   const handleClick = () => {
//     // clear unread flag for this chat
//     const stored = JSON.parse(localStorage.getItem("unreadChats") || "{}");
//     if (stored[chat._id]) {
//       const { [chat._id]: _, ...rest } = stored;
//       localStorage.setItem("unreadChats", JSON.stringify(rest));
//     }
//     // navigate into the room
//     navigate(`/chats/${chat._id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow w-full"
//     >
//       <div className="flex items-center space-x-3">
//         <img
//           src={otherParticipant.profile_picture || "/assets/avatar.png"}
//           alt="Avatar"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div>
//           <h3 className="text-sm font-bold text-gray-800">
//             {otherParticipant.username}
//           </h3>
//           {typeof chat.lastMessage === "string" && chat.lastMessage && (
//             <p className="text-xs text-gray-600 truncate max-w-xs">
//               {chat.lastMessage}
//             </p>
//           )}
//         </div>
//       </div>
//       {chat.lastMessageAt && (
//         <p className="text-xs text-gray-500 mt-2">
//           {new Date(chat.lastMessageAt).toLocaleString()}
//         </p>
//       )}
//     </div>
//   );
// }

// export default ChatCard;

import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChatCard({ chat, unread }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id;

  const other = chat.participants.find(p => p.id !== currentUserId) || {};
  const username = other.username || "Chat";

  return (
    <div
      onClick={() => navigate(`/chats/${chat._id}`)}
      className={`relative bg-white/50 border 
        ${unread ? "border-emerald-500" : "border-gray-200"} 
        rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md`}
    >
      {unread && (
        <span className="absolute top-2 right-2 block w-2 h-2 bg-red-500 rounded-full" />
      )}
      <div className="flex items-center space-x-3">
        <img
          src={other.profile_picture || "/assets/avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-sm text-gray-600 font-bold">{username}</h3>
          <p className="text-xs text-gray-600 truncate max-w-xs">
            {chat.lastMessage}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(chat.lastMessageAt).toLocaleString()}
      </p>
    </div>
  );
}
