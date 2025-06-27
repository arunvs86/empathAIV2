// export default CommunityList;
import React, { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import { useNavigate } from 'react-router-dom';


export default function CommunityList({ onCreateCommunity, onSelectCommunity }) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");
  const nav = useNavigate();


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5003/communities");
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Failed to fetch");
        }
        setCommunities(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visible = communities
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter(c =>
      filter === "all" ? true : c.type === filter
    );

  if (loading) return <p className="text-center text-gray-300">Loading communities…</p>;
  if (error)   return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="space-y-8">
      {/* search & controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search communities…"
          className="flex-1 min-w-[200px] bg-white/20 placeholder-white/70 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="bg-white/20 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="public">Public only</option>
          <option value="private">Private only</option>
        </select>

        {/* <button
          // onClick={onCreateCommunity}
          className="bg-white/20 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-full transition"
        > */}
         <button onClick={() => nav('/communities/create')}>
    + New Community
  </button>
      </div>

      {/* list */}
      {visible.length === 0 ? (
        <p className="text-center text-gray-300">No communities found.</p>
      ) : (
        <div className="space-y-6">
          {visible.map(comm => (
            <CommunityCard
              key={comm._id}
              community={comm}
              onView={onSelectCommunity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
