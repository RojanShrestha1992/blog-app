import React, { useState } from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import Navbar from "../components/Navbar";

const Home = ({ loggedInUser, onLogout }) => {
  const [refresh, setRefresh] = useState(false);
  const [currentView, setCurrentView] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const loggedInUserId = loggedInUser?._id ?? null;

  const handleNavClick = (view) => {
    if (view === "create") {
      setShowModal(true);
    } else {
      setCurrentView(view);
    }
  };
  const closeModal = () => setShowModal(false);
  console.log("loggedInUserId in home", loggedInUserId)
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onNavClick={handleNavClick} user={loggedInUser} onLogout={onLogout} />

      {/* modal for creating post */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              className="absolute right-4 top-4 rounded-lg px-2 py-1 text-2xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="mb-1 text-2xl font-bold text-slate-900">Create a new post</h2>
            <p className="mb-5 text-sm text-slate-600">Write your title, content, and tags to publish instantly.</p>
            <PostForm
              onPostCreated={() => {
                // closeModal();
                setShowModal(false);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      )}

      {/* <PostForm onPostCreated={()=> setRefresh(!refresh)}/> */}

      {/* Views */}
      {currentView === "all" && (
        <PostList key={refresh + "-all"} currentUserId={loggedInUserId} filterByUser={null} />
      )}
      {currentView === "profile" && (
        <PostList
          key={refresh + "-profile"}
          currentUserId={loggedInUserId}
          filterByUser={loggedInUserId}
        />
      )}

      {/* <PostList key={refresh}/> */}
    </div>
  );
};

export default Home;
