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
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/60 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950 lg:grid lg:grid-cols-2">
        <section className="hidden rounded-l-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-slate-50 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">BlogSpace</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white">Write ideas that look as polished as they read.</h1>
            <p className="mt-4 max-w-md text-slate-300">A modern publishing workspace for thoughtful updates, quick comments, and a premium reading experience.</p>
          </div>
          <p className="text-sm text-slate-400">Simple publishing, better reading experience.</p>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">Sign in</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Sign in to manage your posts and profile.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30"
            >
              Login
            </button>
            <p className="text-slate-600 dark:text-slate-400">No account? <span className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300" onClick={()=> navigate("/register")}>Register here</span></p>
          </form>
        </section>
      </div>  
    </main>
  );
};

export default Login;
