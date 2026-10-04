import React from "react";
import { useState } from "react";
import api from "../api/api";
import Message from "../components/Message";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword:"", newPassword:"" });
  const [state, setState] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    setState({});
    try {
      const { data } = await api.patch("/users/password", form);
      setState({ success: data.message });
      setForm({ currentPassword:"", newPassword:"" });
    } catch (err) {
      setState({ error: err.response?.data?.message || "Failed" });
    }
  };

  return (
    <div className="card narrow">
      <h1>Change Password</h1>
      <Message {...state}/>
      <form onSubmit={submit}>
        <label>Current Password<input required type="password" value={form.currentPassword} onChange={e=>setForm({...form,currentPassword:e.target.value})}/></label>
        <label>New Password<input required type="password" minLength="8" maxLength="16" value={form.newPassword} onChange={e=>setForm({...form,newPassword:e.target.value})}/></label>
        <button className="primary">Update Password</button>
      </form>
    </div>
  );
}
