import React, { useState } from "react";
import API from "../api/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
        const {data} = await API.post("/auth/login", {email, password})
        console.log("Login successful", data)
        onLogin() // refresh parent ui
    }
    catch(err){
        console.error("Login failed", err)
    }

  }
  return (
    <form className="max-w-md mx-auto p-4" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
