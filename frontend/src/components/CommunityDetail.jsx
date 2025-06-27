// src/components/CommunityDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { dedupe } from "../utils/localStorageUtils";
import { createGroupChat } from "../services/chatApi";

export default function CommunityDetail({ communityId, onBack }) {
  const navigate = useNavigate();
  const params   = useParams();
  const id       = communityId || params.id;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [community,       setCommunity]       = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [posts,           setPosts]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");

  const [newPostContent, setNewPostContent] = useState("");
  const [createError,    setCreateError]    = useState("");
  const [createLoading,  setCreateLoading]  = useState(false);

  const [isFavorited, setIsFavorited] = useState(false);

  // ─── Load favorite status ───────────────────────────────────────────
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("myFavorites") || "[]");
    setIsFavorited(
      favs.some(f => f.id === id && f.type === "community")
    );
  }, [id]);

  // ─── Fetch community & its posts ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        // 1) Fetch community
        let response = await fetch(
          `http://localhost:5003/communities/${id}`
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch community");
        }
        const communityData = await response.json();

        // 2) Fetch posts
        response = await fetch(
          `http://localhost:5003/posts/community/${id}`
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
    })();
  }, [id]);

  // ─── Load pending join requests ──────────────────────────────────
  useEffect(() => {
    (async () => {
      if (
        !community ||
        (community.createdBy !== currentUser.id &&
         !community.moderators.includes(currentUser.id))
      ) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5003/communities/${community._id}/requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to load requests");
        const data = await res.json();
        setPendingRequests(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [community, currentUser.id]);

  // ─── Record recently viewed ─────────────────────────────────────
  useEffect(() => {
    if (!community) return;
    const key = "recentlyViewedCommunities";
    let arr = JSON.parse(localStorage.getItem(key) || "[]")
      .filter(item => item.id !== id);
    arr.unshift({
      id,
      name: community.name,
      link: `/communities/${id}`
    });
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 10)));
  }, [community, id]);

  // ─── Toggle favorite ─────────────────────────────────────────────
  const toggleFavorite = () => {
    const key  = "myFavorites";
    const favs = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = favs.find(f => f.id === id && f.type === "community");
    let updated;
    if (exists) {
      updated = favs.filter(f => !(f.id === id && f.type === "community"));
    } else {
      updated = [
        ...favs,
        { id, type: "community", name: community.name, link: `/communities/${id}` },
      ];
    }
    updated = dedupe(updated, ["type", "id"]);
    localStorage.setItem(key, JSON.stringify(updated));
    setIsFavorited(!exists);
    window.location.reload();
  };

  // ─── Create a new post ────────────────────────────────────────────
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
      const response = await fetch(
        "http://localhost:5003/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newPostContent,
            community_id: id,
          }),
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create post");
      }
      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setNewPostContent("");
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  // ─── Handle join/request/leave ────────────────────────────────────
  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5003/communities/${community._id}/join`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Join failed");
      setCommunity(c => ({ ...c, members: [...c.members, currentUser.id] }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestToJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5003/communities/${community._id}/request`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Request failed");
      alert("Join request sent");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5003/communities/${community._id}/leave`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Leave failed");
      setCommunity(c => ({
        ...c,
        members: c.members.filter(uid => uid !== currentUser.id),
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-gray-200">Loading community…</p>;
  if (error)   return <p className="text-red-400">{error}</p>;
  if (!community) return <p className="text-gray-200">Community not found.</p>;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="font-calligraphy text-4xl text-white">
            {community.name}
          </h1>
          <p className="text-gray-100 mt-1 leading-snug">
            {community.description}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-white/80 hover:text-white">
            ← Back
          </button>
          <button onClick={toggleFavorite} className="text-2xl text-white/80 hover:text-white">
            {isFavorited ? "★" : "☆"}
          </button>
          <button
            onClick={async () => {
              const chat = await createGroupChat(id);
              navigate(`/chats/${chat._id}`);
            }}
            className="bg-white/80 text-gray-800 px-4 py-2 rounded-full hover:bg-white"
          >
            Open Community Chat
          </button>
        </div>
      </div>

      {/* Membership Actions */}
      <div className="flex space-x-4">
        {!community.members.includes(currentUser.id) ? (
          community.type === "public" ? (
            <button
              onClick={handleJoin}
              className="bg-white/20 hover:bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-green-500"
            >
              Join Community
            </button>
          ) : (
            <button
              onClick={handleRequestToJoin}
              className="bg-blue-400 text-white px-4 py-2 rounded-full hover:bg-blue-500"
            >
              Request to Join
            </button>
          )
        ) : (
          <button
            onClick={handleLeave}
            className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-500"
          >
            Leave Community
          </button>
        )}
      </div>

      {/* Pending Join Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Join Requests
          </h2>
          <ul className="space-y-2">
            {pendingRequests.map(u => (
              <li key={u.id} className="flex justify-between items-center">
                <span className="text-gray-900">{u.username}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRequest(u.id, "approve")}
                    className="px-3 py-1 bg-green-300 rounded-full text-green-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(u.id, "reject")}
                    className="px-3 py-1 bg-red-300 rounded-full text-red-800"
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
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
        <h2 className="font-calligraphy text-3xl text-white mb-4">
          Share in {community.name}
        </h2>
        {createError && <p className="text-red-400 mb-2">{createError}</p>}
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full bg-white/20 placeholder-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/70 resize-none"
          />
          <button
            type="submit"
            disabled={createLoading}
            className="bg-emerald-400 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-500"
          >
            {createLoading ? "Posting…" : "Post"}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-gray-200">No posts in this community yet.</p>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
