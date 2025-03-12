// import React, { useState } from "react";
// import Header from "../components/Header";
// import LeftSidebar from "../components/LeftSidebar";
// import RightSidebar from "../components/RightSidebar";
// import MainContent from "../components/MainContent";
// import CreatePost from "../components/CreatePost";
// import CommunityView from "../components/CommunityView"; // New import for communities view
// import BottomNav from "../components/BottomNav";

// function HomeLayout() {
//   // activeTab can be "home", "community", "create", "messages", or "bot"
//   const [activeTab, setActiveTab] = useState("home");

//   // Callback after a successful post creation, for example switch back to home
//   const handlePostCreated = (newPost) => {
//     // Here you can also refresh your posts feed if needed
//     setActiveTab("home");
//   };

//   return (
//     <div className="relative w-full h-screen bg-gray-50">
//       {/* Header */}
//       <Header />

//       {/* Left Sidebar */}
//       <div className="hidden md:block fixed top-16 left-0 w-60 h-[calc(100%-4rem)] bg-white border-r border-gray-200 shadow-md">
//         <LeftSidebar />
//       </div>

//       {/* Right Sidebar */}
//       <div className="hidden lg:block fixed top-16 right-0 w-60 h-[calc(100%-4rem)] bg-white border-l border-gray-200 shadow-md">
//         <RightSidebar />
//       </div>

//       {/* Main Content Area */}
//       <div className="pt-16 ml-0 md:ml-60 lg:mr-60 h-[calc(100%-4rem)] overflow-auto">
//         <div className="max-w-3xl mx-auto px-4 pb-24">
//           {activeTab === "home" && <MainContent />}
//           {activeTab === "create" && <CreatePost onPostCreated={handlePostCreated} />}
//           {activeTab === "community" && <CommunityView />}
//           {/* Add conditions for messages and bot as needed */}
//         </div>
//       </div>

//       {/* Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 md:left-60 lg:right-60 z-20 flex justify-center">
//         <div className="w-full max-w-3xl">
//           <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomeLayout;

import React from "react";
import { Outlet } from "react-router-dom"; // We'll use Outlet here
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import BottomNav from "../components/BottomNav";

function HomeLayout() {
  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Left Sidebar */}
      <div className="hidden md:block fixed top-16 left-0 w-60 h-[calc(100%-4rem)] bg-white border-r border-gray-200 shadow-md">
        <LeftSidebar />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block fixed top-16 right-0 w-60 h-[calc(100%-4rem)] bg-white border-l border-gray-200 shadow-md">
        <RightSidebar />
      </div>

      {/* Main Content Area */}
      <div className="pt-16 ml-0 md:ml-60 lg:mr-60 h-[calc(100%-4rem)] overflow-auto">
        <div className="max-w-3xl mt-3 mx-auto px-4 pb-24">
          {/* This is where child routes will render */}
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:left-60 lg:right-60 z-20 flex justify-center">
        <div className="w-full max-w-3xl">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
