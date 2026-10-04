import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Message from "../components/Message";

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        setUser(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user");
      }
    };

    load();
  }, [id]);

  if (error) {
    return (
      <div className="card">
        <Message error={error} />
      </div>
    );
  }

  if (!user) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h1>User Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {user.role === "OWNER" && (
        <p>
          <strong>Store Rating:</strong>{" "}
          {Number(user.rating || 0).toFixed(2)}
        </p>
      )}
    </div>
  );
}
