import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomeLayout from "./layout/HomeLayout";
import Therapists from "./pages/Therapists";          
import TherapistDetail from "./pages/TherapistDetail"; 
import ChatDetail from "./pages/ChatDetail";
import ChatList from "./pages/ChatList";


// Child pages for inside HomeLayout
import MainContent from "./components/MainContent";
import CreatePost from "./components/CreatePost";
import CommunityView from "./components/CommunityView";
import CommunityDetail from "./components/CommunityDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/:type" element={<Signup />} />
        <Route path="/" element={<HomeLayout />}>
          {/* Nested routes rendered in HomeLayout's <Outlet /> */}
          <Route index element={<MainContent />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="communities" element={<CommunityView />} />
          <Route path="communities/:id" element={<CommunityDetail />} />
          {/* <Route path="messages" element={<Messages />} /> */}
          {/* Add other routes as needed */}
          
          <Route path="/therapists" element={<Therapists />} />
        <Route path="/therapists/:id" element={<TherapistDetail />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chats/:chatId" element={<ChatDetail />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
