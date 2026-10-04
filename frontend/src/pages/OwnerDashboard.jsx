import React from "react";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/owner/dashboard")
      .then(({data})=>setData(data))
      .catch(err=>setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <div className="message error">{error}</div>;
  if (!data) return <div className="center">Loading...</div>;

  return (
    <>
      <h1>Store Owner Dashboard</h1>
      <div className="stats">
        <div className="stat"><span>Store</span><strong>{data.store.name}</strong></div>
        <div className="stat"><span>Average Rating</span><strong>{Number(data.store.average_rating||0).toFixed(2)}</strong></div>
        <div className="stat"><span>Submitted Ratings</span><strong>{data.raters.length}</strong></div>
      </div>
      <h2>Users Who Submitted Ratings</h2>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th><th>Date</th></tr></thead>
        <tbody>{data.raters.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.email}</td><td>{r.address}</td><td>{r.rating}</td><td>{new Date(r.ratedAt).toLocaleString()}</td></tr>)}</tbody>
      </table>
    </>
  );
}
