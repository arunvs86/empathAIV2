import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import BottomNav from '../components/BottomNav';

export default function HomeLayout() {
  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Header with integrated navigation */}
      <Header />

      {/* Left Sidebar */}
      <div className="hidden md:block fixed top-16 left-0 w-48 h-[calc(100%-4rem)] bg-white border-r border-gray-200 shadow-sm">
        <LeftSidebar />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block fixed top-16 right-0 w-48 h-[calc(100%-4rem)] bg-white border-l border-gray-200 shadow-sm">
        <RightSidebar />
      </div>

      {/* Main Content Area */}
      <div className="pt-16 ml-0 md:ml-48 lg:mr-48 h-[calc(100%-4rem)] overflow-auto">
        <div className="max-w-3xl mx-auto mt-4 px-4 pb-24">
          <Outlet />
        </div>
      </div>
    </div>
  );
}