import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, onSuccess }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
        const {data} = await API.post("/auth/login", {email, password})
        console.log("Login successful", data)
      onLogin(data)
      onSuccess?.("Login successful!")
      navigate("/")
    }
    catch(err){
        console.error("Login failed", err)
    }

  }
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid lg:grid-cols-2">
        <section className="hidden rounded-l-3xl bg-slate-900 p-10 text-slate-100 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Blog App</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Write ideas that people actually want to read.</h1>
            <p className="mt-4 text-slate-300">Share stories, publish updates, and keep everything organized in one clean workspace.</p>
          </div>
          <p className="text-sm text-slate-400">Simple publishing, better reading experience.</p>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">Sign in to manage your posts and profile.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Login
            </button>
            <p>No Account? <span className="text-blue-600 cursor-pointer" onClick={()=> navigate("/register")}>Register Here</span> </p>
          </form>
        </section>
      </div>  
    </main>
  );
};

export default Login;
