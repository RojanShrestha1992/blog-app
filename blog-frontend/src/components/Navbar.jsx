import React from "react";
import { useNavigate } from "react-router-dom";
const Navbar = ({ onNavClick, user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            className="text-2xl font-black tracking-tight text-slate-900"
            onClick={() => onNavClick("all")}
          >
            BlogSpace
          </button>
          <button
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            onClick={() => onNavClick("all")}
          >
            All Posts
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:bg-blue-700 px-3 py-1 rounded"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hover:bg-blue-700 px-3 py-1 rounded"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                onClick={() => onNavClick("create")}
              >
                Create Post
              </button>
              <button
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={() => onNavClick("profile")}
              >
                My Posts
              </button>
              <button
                onClick={onLogout}
                className="hover:bg-red-700 px-3 py-1 rounded"
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
