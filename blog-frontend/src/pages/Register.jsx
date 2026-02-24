import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = ({ onRegister, onSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await API.post(
                "/auth/register",
                { name, email, password },
                { withCredentials: true }
            );
            onRegister(data.user);
            onSuccess?.("Registration successful!");
            navigate("/");
        } catch (err) {
            console.error("Registration failed", err);
            setError(err?.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

  return (
        <main className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid lg:grid-cols-2">
                <section className="hidden rounded-l-3xl bg-slate-900 p-10 text-slate-100 lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Blog App</p>
                        <h1 className="mt-6 text-4xl font-bold leading-tight">Create your account and start publishing today.</h1>
                        <p className="mt-4 text-slate-300">Join the writing space where your posts stay organized and easy to share.</p>
                    </div>
                    <p className="text-sm text-slate-400">Fast setup, clean workflow.</p>
                </section>

                <section className="p-8 sm:p-10 lg:p-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
                        <p className="mt-2 text-sm text-slate-600">Sign up to write posts and manage your profile.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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

                        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                        <p className="text-sm text-slate-600">
                            Already have an account?{" "}
                            <span
                                className="cursor-pointer font-medium text-slate-900 underline underline-offset-2"
                                onClick={() => navigate("/login")}
                            >
                                Login here
                            </span>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default Register;