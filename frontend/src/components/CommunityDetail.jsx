import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { dedupe } from "../utils/localStorageUtils";
import { createGroupChat } from "../services/chatApi";


function CommunityDetail({ communityId, onBack }) {
  const navigate = useNavigate();
  const  params = useParams();
  const id = communityId || params.id || CommunityId;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [community, setCommunity] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For creating a post
  const [newPostContent, setNewPostContent] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // ─── NEW: Favorite toggle state ───────────────────────────────────────────
  const [isFavorited, setIsFavorited] = useState(false);

  // ─── NEW: load favorite status on mount ─────────────────────────────────
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("myFavorites") || "[]");
    setIsFavorited(
      favs.some(
        (f) => f.id === communityId && f.type === "community"
      )
    );
  }, [communityId]);
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Fetch community
        let response = await fetch(
          `https://empathaiv2-backend.onrender.com/communities/${id}`
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch community");
        }
        const communityData = await response.json();

        // 2) Fetch posts for this community
        response = await fetch(
          `https://empathaiv2-backend.onrender.com/posts/community/${id}`
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch community posts");
        }
        const postData = await response.json();

        setCommunity(communityData);
        setPosts(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityId]);

  useEffect(() => {
    const loadRequests = async () => {
      // only for mods/creator
      if (
        !community ||
        (community.createdBy !== currentUser.id &&
         !community.moderators.includes(currentUser.id))
      ) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://empathaiv2-backend.onrender.com/communities/${community._id}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to load requests");
        const data = await res.json();
        console.log("Pending request:", data)
        setPendingRequests(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadRequests();
  }, [community]);

  // ─── NEW: record “recently viewed” whenever community changes ───────────────
  // useEffect(() => {
  //   if (!community) return;
  //   const key = "recentlyViewedCommunities";
  //   const existing = JSON.parse(localStorage.getItem(key) || "[]");
  //   // remove duplicates
  //   const filtered = existing.filter((c) => c.id !== community.id);
  //   // add newest at front, cap at 10
  //   const updated = [
  //     {
  //       id: communityId,
  //       name: community.name,
  //       link: `/communities/${communityId}`,
  //     },
  //     ...filtered,
  //   ].slice(0, 10);
  //   localStorage.setItem(key, JSON.stringify(updated));
  // }, [community]);

  useEffect(() => {
    if (!community) return;
  
    const key = "recentlyViewedCommunities";
    const old = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = old.filter(item => item.id !== communityId);
    filtered.unshift({
      id: communityId,
      name: community.name,
      link: `/communities/${communityId}`
    });
    const updated = filtered.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  }, [community]);

  // ───────────────────────────────────────────────────────────────────────────

  // ─── NEW: favorite toggle handler ─────────────────────────────────────────
  // const toggleFavorite = () => {
  //   const key = "myFavorites";
  //   const favs = JSON.parse(localStorage.getItem(key) || "[]");
  //   const exists = favs.find(
  //     (f) => f.id === communityId && f.type === "community"
  //   );

  //   let updated;
  //   if (exists) {
  //     // remove
  //     updated = favs.filter(
  //       (f) => !(f.id === communityId && f.type === "community")
  //     );
  //     setIsFavorited(false);
  //   } else {
  //     // add
  //     updated = [
  //       ...favs,
  //       {
  //         id: id,
  //         type: "community",
  //         name: community.name,
  //         link: `/communities/${id}`,
  //       },
  //     ];
  //     setIsFavorited(true);
  //   }
  //   localStorage.setItem(key, JSON.stringify(updated));
  // };

  const toggleFavorite = () => {
    const key  = "myFavorites";
    const favs = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = favs.find(f => f.id === communityId && f.type === "community");
  
    let updated;
    if (exists) {
      updated = favs.filter(f => !(f.id === communityId && f.type === "community"));
    } else {
      updated = [ 
        ...favs, 
        { id: communityId, type: "community", name: community.name, link: `/communities/${communityId}` } 
      ];
    }
  
  // now dedupe by both `type` and `id` to strip any stray dupes:
   updated = dedupe(updated, ["type","id"]);
  
    localStorage.setItem(key, JSON.stringify(updated));
    setIsFavorited(!exists);
  };
  // ───────────────────────────────────────────────────────────────────────────

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setCreateError("Not authenticated. Please log in.");
      setCreateLoading(false);
      return;
    }

    try {
      const response = await fetch("https://empathaiv2-backend.onrender.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newPostContent,
          community_id: communityId,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create post");
      }
      const newPost = await response.json();
      // Insert the new post at the top
      setPosts((prev) => [newPost, ...prev]);
      setNewPostContent("");
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRequest = async (userId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://empathaiv2-backend.onrender.com/communities/${community._id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId, action }) // action: "approve" or "reject"
        }
      );
      if (!res.ok) throw new Error("Request failed");
      // remove from local list
      setPendingRequests((prev) => prev.filter((u) => u.id !== userId));
      // if approved, also reflect in community.members
      if (action === "approve") {
        setCommunity((c) => ({
          ...c,
          members: [...c.members, userId]
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Could not " + action + " request");
    }
  };

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://empathaiv2-backend.onrender.com/communities/${community._id}/join`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Join failed");
      setCommunity(c => ({ ...c, members: [...c.members, currentUser.id] }));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  
  const handleRequestToJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://empathaiv2-backend.onrender.com/communities/${community._id}/request`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Request failed");
      alert("Join request sent");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  
  const handleLeave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://empathaiv2-backend.onrender.com/communities/${community._id}/leave`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Leave failed");
      setCommunity(c => ({
        ...c,
        members: c.members.filter((id) => id !== currentUser.id)
      }));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p className="text-gray-700">Loading community...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!community)
    return <p className="text-gray-500">Community not found.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-emerald-600">
          {community.name}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="text-emerald-600 hover:underline"
          >
            Back
          </button>

          <button
          onClick={async () => {
            try {
              const chat = await createGroupChat(communityId);
              navigate(`/chats/${chat._id}`);
            } catch (err) {
              console.error(err);
              alert("Could not open community chat.");
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm"
        >
          Open Community Chat
       </button>

          {/* ─── NEW: Favorite button ────────────────────────────── */}
          <button
            onClick={toggleFavorite}
            className="text-emerald-600 hover:text-emerald-800"
          >
            {isFavorited ? "★ Unfavorite" : "☆ Add to Favorites"}
          </button>
          {/* ─────────────────────────────────────────────────────── */}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <p className="text-gray-700 mb-2">{community.description}</p>
        <span
          className={`px-2 py-1 text-xs rounded ${
            community.type === "public"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {community.type === "public" ? "Public" : "Private"}
        </span>
      </div>

      {/* …inside your JSX, below the type badge… */}
{!community.members.includes(currentUser.id) ? (
  community.type === "public" ? (
    <button
      onClick={handleJoin}
      className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
    >
      Join Community
    </button>
  ) : (
    <button
      onClick={handleRequestToJoin}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
    >
      Request to Join
    </button>
  )
) : (
  <button
    onClick={handleLeave}
    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
  >
    Leave Community
  </button>
)}


      {/* Pending join requests (mods/creator only) */}
{pendingRequests.length > 0 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
    <h3 className="font-semibold mb-2">Join Requests</h3>
    <ul className="space-y-2">
      {pendingRequests.map((u) => (
        <li key={u.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={u.profile_picture || "/assets/avatar.png"}
              alt={u.username}
              className="w-6 h-6 rounded-full"
            />
            <span>{u.username}</span>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleRequest(u.id, "approve")}
              className="px-2 py-1 bg-green-200 text-green-800 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleRequest(u.id, "reject")}
              className="px-2 py-1 bg-red-200 text-red-800 rounded"
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}


      {/* Create Post Form */}
      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Create a Post in {community.name}
        </h3>
        {createError && <p className="text-red-600 mb-2">{createError}</p>}
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            rows="3"
            required
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={createLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {createLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts in this community yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default CommunityDetail;
