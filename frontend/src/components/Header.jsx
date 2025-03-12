import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarUrl = currentUser.profile_picture || "/src/assets/avatar.png";
  const username = currentUser.username || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-md z-20 flex items-center justify-between px-4">
      {/* Left: Brand/Logo */}
      <div className="flex items-center space-x-2">
        <h1
          className="text-emerald-600 font-bold text-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          EmpathAI
        </h1>
      </div>

      {/* Right: Avatar, Username, Notifications & Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-700 text-sm">
            {username}
          </span>
        </div>
        <button
          onClick={() => alert("Notifications clicked")}
          className="relative"
        >
          <span className="material-icons text-gray-600">Notifications</span>
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span> */}
        </button>
        <button
          onClick={handleLogout}
          className="text-gray-700 hover:text-emerald-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
