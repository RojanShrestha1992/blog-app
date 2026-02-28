import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = ({ onNavClick, user, onLogout }) => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(user && user._id)
  return (
    <header className="sticky top-0 z-30 border-b border-indigo-200/80 bg-indigo-50/80 shadow-sm shadow-indigo-200/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            className="bg-linear-to-r from-indigo-700 to-violet-600 bg-clip-text text-2xl font-black tracking-tight text-transparent"
            onClick={() => onNavClick("all")}
          >
            BlogSpace
          </button>
          <button
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:inline-flex"
            onClick={() => onNavClick("all")}
          >
            All Posts
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg border border-indigo-300 bg-indigo-100/80 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
                onClick={() => onNavClick("create")}
              >
                Create Post
              </button>
              <Link
                to={`/profile/${user._id}`}
                className="inline-flex rounded-lg border border-indigo-300 bg-indigo-100/80 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                // className="rounded-lg border border-indigo-300 bg-indigo-100/80 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                onClick={() => onNavClick("profile")}
              >
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
