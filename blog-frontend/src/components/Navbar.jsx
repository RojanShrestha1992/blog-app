import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsMoon, BsSun } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ onNavClick, user, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = Boolean(user?._id);

  const handleNavigate = (view) => {
    setMobileMenuOpen(false);

    if (onNavClick) {
      onNavClick(view);
      return;
    }

    if (view === "all") {
      navigate("/");
      return;
    }

    if (view === "create") {
      navigate("/", { state: { openCreateModal: true } });
      return;
    }

    if (view === "profile" && user?._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    if (onLogout) {
      await onLogout();
      return;
    }
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 shadow-sm shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75 dark:shadow-black/20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl"
            onClick={() => handleNavigate("all")}
          >
            BlogSpace
          </button>
          <button
            type="button"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex"
            onClick={() => handleNavigate("all")}
          >
            All Posts
          </button>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <BsSun className="h-4 w-4" /> : <BsMoon className="h-4 w-4" />}
          </button>

          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-full bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-full bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30"
                onClick={() => handleNavigate("create")}
              >
                Create Post
              </button>
              <Link
                to={`/profile/${user._id}`}
                title={user?.name || "Profile"}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                onClick={() => handleNavigate("profile")}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || "Profile"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden pr-1 lg:inline">Profile</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <BsSun className="h-4 w-4" /> : <BsMoon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <CiMenuKebab className="h-5 w-5" />
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-4 top-16 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30">
              <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => handleNavigate("all")}>All Posts</button>
              {!isAuthenticated ? (
                <>
                  <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}>Login</button>
                  <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => { setMobileMenuOpen(false); navigate("/register"); }}>Register</button>
                </>
              ) : (
                <>
                  <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => handleNavigate("create")}>Create Post</button>
                  <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" onClick={() => handleNavigate("profile")}>Profile</button>
                  <button type="button" className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40" onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
