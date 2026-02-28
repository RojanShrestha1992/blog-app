import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
        const {data} = await API.post("/auth/login", {email, password})
      onLogin(data)
      toast.success("Login successful!")
      navigate("/")
    }
    catch(err){
        console.error("Login failed", err)
        toast.error("Login failed. Please check your credentials.")
    }

  }
  return (
    <main className="min-h-screen bg-transparent px-4 py-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-indigo-200/90 bg-indigo-50/90 shadow-2xl shadow-indigo-300/60 backdrop-blur-sm lg:grid lg:grid-cols-2">
        <section className="hidden rounded-l-3xl bg-indigo-900 p-10 text-indigo-50 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-200">BlogSpace</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Write ideas that people actually want to read.</h1>
            <p className="mt-4 text-indigo-200">Share stories, publish updates, and keep everything organized in one clean workspace.</p>
          </div>
          <p className="text-sm text-indigo-300">Simple publishing, better reading experience.</p>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-indigo-950">Welcome back</h2>
            <p className="mt-2 text-sm text-indigo-600">Sign in to manage your posts and profile.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-medium text-indigo-800">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-indigo-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-indigo-800">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-indigo-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Login
            </button>
            <p className="text-indigo-700">No Account? <span className="cursor-pointer font-medium text-violet-600 hover:text-violet-700" onClick={()=> navigate("/register")}>Register Here</span> </p>
          </form>
        </section>
      </div>  
    </main>
  );
};

export default Login;
