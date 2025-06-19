// // import React from 'react';
// // import { Outlet } from 'react-router-dom';
// // import Header from '../components/Header';
// // import LeftSidebar from '../components/LeftSidebar';
// // import RightSidebar from '../components/RightSidebar';
// // import BottomNav from '../components/BottomNav';

// // export default function HomeLayout() {
// //   return (
// //     <div className="relative w-full h-screen bg-gray-50">
// //       {/* Header with integrated navigation */}
// //       <Header />

// //       {/* Left Sidebar */}
// //       <div className="hidden md:block fixed top-16 left-0 w-48 h-[calc(100%-4rem)] bg-white border-r border-gray-200 shadow-sm">
// //         <LeftSidebar />
// //       </div>

// //       {/* Right Sidebar */}
// //       <div className="hidden lg:block fixed top-16 right-0 w-48 h-[calc(100%-4rem)] bg-white border-l border-gray-200 shadow-sm">
// //         <RightSidebar />
// //       </div>

// //       {/* Main Content Area */}
// //       <div className="pt-16 ml-0 md:ml-48 lg:mr-48 h-[calc(100%-4rem)] overflow-auto">
// //         <div className="max-w-3xl mx-auto mt-4 px-4 pb-24">
// //           <Outlet />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/layout/HomeLayout.jsx

// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { Leaf } from 'lucide-react';
// import Header from '../components/Header';
// import LeftSidebar from '../components/LeftSidebar';
// import RightSidebar from '../components/RightSidebar';
// import BottomNav from '../components/BottomNav';

// // Place a looping MP4 here for best performance
// import bgVideo from '/assets/background.mp4';

// export default function HomeLayout() {
//   return (
//     <div className="relative w-full h-screen overflow-hidden font-sans text-gray-800">
//       {/* Video background */}
//       <video
//         autoPlay
//         loop
//         muted
//         className="absolute inset-0 object-cover w-full h-full -z-50 pointer-events-none"
//         >
//         <source src={bgVideo} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Semi-dark overlay for contrast */}
//       <div className="absolute inset-0 bg-black/30 -z-40 pointer-events-none"></div>

//       {/* Header (always on top) */}
//       <div className="relative z-50">
//       <Header />
//       </div>

//       {/* Main flex layout */}
//       <div className="relative z-10 flex pt-20 h-[calc(100%-4rem)]">
//         {/* Left Sidebar */}
//         <aside className="hidden md:block w-52 p-4">
//           {/* <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl h-full overflow-auto shadow-md"> */}
//             <LeftSidebar />
//           {/* </div> */}
//         </aside>

//         {/* Center Content */}
//         <main className="flex-1 overflow-y-auto px-6 pb-24">
//           <div className="max-w-3xl mx-auto space-y-8">
//             {/* Hero Card */}
//             {/* <div className="mx-auto max-w-2xl bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 text-center shadow-lg"> */}
//               <h1 className="font-calligraphy text-5xl md:text-6xl text-white drop-shadow-lg leading-tight">
//                 Healing begins with a single breath !
//               </h1>
//               <p className="text-white/90 mt-2">
//                 {/* Let your thoughts flow freely—this is your sanctuary. */}
//               </p>
//             {/* </div> */}

//             {/* Affirmation Card */}
//             {/* <div className="mx-auto max-w-2xl flex items-center bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-md">
//               <Leaf className="w-8 h-8 text-emerald-300 mr-3 opacity-60" />
//               <div>
//                 <h3 className="text-lg font-semibold text-white">
//                   Affirmation of the Day
//                 </h3>
//                 <p className="text-white/80 mt-1 italic text-sm">
//                   “I give myself permission to feel and heal.”
//                 </p>
//               </div>
//             </div> */}

//             {/* Create Post + Feed */}
//             <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6">
//               <Outlet />
//             </div>
//           </div>
//         </main>

//         {/* Right Sidebar */}
//         <aside className="hidden lg:block w-52 p-4">
//           {/* <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl h-full overflow-auto shadow-md"> */}
//             <RightSidebar />
//           {/* </div> */}
//         </aside>
//       </div>

//       {/* Bottom Navigation (mobile only) */}
//       <div className="md:hidden relative z-10">
//         <BottomNav />
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { Outlet,useLocation } from 'react-router-dom';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import BottomNav from '../components/BottomNav';

import bgVideo from '/assets/background.mp4';

export default function HomeLayout() {

  const location = useLocation();
  // detect if we're on /communities (or deeper)
  const isCommunities = location.pathname.startsWith("/communities");
  const isJournals = location.pathname.match(/^\/profile\/[^/]+\/journals/) != null
  const isLetters = location.pathname.startsWith("/letters");

  let tagline = "Healing begins with a single deep breath!"

  if(isCommunities)
  {
    tagline = "We shall surf the grief waves together!"
  }

  if(isJournals)
    {
      tagline = "Converse with Your Inner Self, One Day at a Time"
    }

  if(isLetters)
      {
        tagline = "Your Words, Their Memory—A Personal Letter for Healing"
      }
    
  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-white">
      {/* Video background (non-interactive) */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full -z-50 pointer-events-none"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 -z-40 pointer-events-none" />

      {/* Header (glass, clickable) */}
      <div className="relative z-50 pointer-events-auto">
        <Header />
      </div>

      {/* Main layout */}
      <div className="relative z-20 flex pt-20 h-[calc(100%-4rem)]">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-52 p-4 relative pointer-events-auto z-30">
          <LeftSidebar />
        </aside>

        {/* Centre Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 relative pointer-events-auto z-30">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Hero */}
            {/* <div className="mx-auto max-w-2xl bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg"> */}
              <h1 className="font-calligraphy text-center text-5xl leading-tight">
                  {tagline}
              </h1>
            {/* </div> */}



            {/* Post + Feed */}
            <div className="rounded-2xl shadow-lg p-6">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-52 p-4 relative pointer-events-auto z-30">
          <RightSidebar />
        </aside>
      </div>

      {/* Bottom Nav (mobile) */}
      <div className="md:hidden relative z-50 pointer-events-auto">
        <BottomNav />
      </div>
    </div>
  );
}
