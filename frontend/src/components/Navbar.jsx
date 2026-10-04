import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const home =
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "OWNER"
      ? "/owner"
      : "/stores";

  return (
    <nav className="nav">
      <Link className="brand" to={home}>Roxiler Ratings</Link>
      <div className="nav-right">
        <span>{user.name}</span>
        <span className="role">{user.role}</span>
        <Link to="/change-password">Change Password</Link>
        <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
      </div>
    </nav>
  );
}
