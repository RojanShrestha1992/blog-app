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
        <main className="min-h-screen bg-transparent px-4 py-10">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-indigo-200/90 bg-indigo-50/90 shadow-2xl shadow-indigo-300/60 backdrop-blur-sm lg:grid lg:grid-cols-2">
                <section className="hidden rounded-l-3xl bg-indigo-900 p-10 text-indigo-50 lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-200">Blog App</p>
                        <h1 className="mt-6 text-4xl font-bold leading-tight">Create your account and start publishing today.</h1>
                        <p className="mt-4 text-indigo-200">Join the writing space where your posts stay organized and easy to share.</p>
                    </div>
                    <p className="text-sm text-indigo-300">Fast setup, clean workflow.</p>
                </section>

                <section className="p-8 sm:p-10 lg:p-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-indigo-950">Create account</h2>
                        <p className="mt-2 text-sm text-indigo-600">Sign up to write posts and manage your profile.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-indigo-800">Full name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-indigo-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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

                        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                        <p className="text-sm text-indigo-700">
                            Already have an account?{" "}
                            <span
                                className="cursor-pointer font-medium text-violet-600 underline underline-offset-2"
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