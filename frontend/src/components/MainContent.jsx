// src/components/MainContent.jsx
import React, { useState, useEffect, useMemo } from "react";
import PostList from "./PostList";
import PostComposer from "./PostComposer";
import { useLocation } from "react-router-dom";

function MainContent() {
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Search / filter / sort state
  const [searchText, setSearchText]       = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [sortOrder, setSortOrder]         = useState("desc"); // 'desc' = newest first

    useEffect(() => {
        if (location.pathname === "/faith") {
          setSearchText("");
          setSelectedTopic("Religious Support");
        setSortOrder("desc");
        }
        // else: leave user’s manual choice intact
     }, [location.pathname]);

  // Fetch posts once on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in.");
        const res = await fetch("https://empathaiv2-backend.onrender.com/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch posts.");
        }
        setPosts(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Gather all unique topics for the dropdown
  const allTopics = useMemo(() => {
    const topics = posts.flatMap((p) => p.categories || []);
    return Array.from(new Set(topics));
  }, [posts]);

  // Derive filtered + sorted list
  const filteredPosts = useMemo(() => {
    let arr = posts;

    // Full-text search on content or username
    if (searchText) {
      const q = searchText.toLowerCase();
      arr = arr.filter((p) => {
        const text   = (p.content  || "").toLowerCase();
        const author = (p.username || "").toLowerCase();
        return text.includes(q) || author.includes(q);
      });
    }

    // Filter by selected topic
    if (selectedTopic) {
      arr = arr.filter((p) => (p.categories || []).includes(selectedTopic));
    }

    // Sort by createdAt
    arr = arr.slice().sort((a, b) => {
      const da = new Date(a.createdAt || 0);
      const db = new Date(b.createdAt || 0);
      return sortOrder === "desc" ? db - da : da - db;
    });

    return arr;
  }, [posts, searchText, selectedTopic, sortOrder]);

  // Toggle sort order
  const toggleSort = () =>
    setSortOrder((o) => (o === "desc" ? "asc" : "desc"));

  // Handle new post creation: prepend + reset filters
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setSearchText("");
    setSelectedTopic("");
    setSortOrder("desc");
  };

  if (loading) return <p>Loading posts…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between mb-6 space-y-2">
        <input
          type="text"
          placeholder="Search by content or username…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded px-3 py-2 flex-1 max-w-xs text-bold focus:ring-emerald-400 text-white placeholder-white/70 bg-transparent"
        />

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="border rounded px-3 py-2 focus:ring-emerald-400"
        >
          <option value="">All Topics</option>
          {allTopics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          onClick={toggleSort}
          className="border rounded px-3 py-2"
        >
          Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500">No posts match your criteria.</p>
      ) : (
        <PostList posts={filteredPosts} />
      )}
    </div>
  );
}

export default MainContent;
