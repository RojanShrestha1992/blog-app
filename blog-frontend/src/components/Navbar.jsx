import React from "react";

const Navbar = ({ onNavClick }) => {
  return (
    <>
      <nav className="bg-gray-800 flex justify-between items-center text-white p-4">
        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => onNavClick("all")}
        >
          All Posts
        </h1>
        <div className="space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onNavClick("create")}
          >
            Create Post
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onNavClick("profile")}
          >
            Profile
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
