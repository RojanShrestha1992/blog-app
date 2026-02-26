import React, { useState } from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import Navbar from "../components/Navbar";

const Home = ({ loggedInUser, onLogout, onSuccess }) => {
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
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar onNavClick={handleNavClick} user={loggedInUser} onLogout={onLogout} />

      {/* modal for creating post */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/55 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-indigo-200/90 bg-indigo-50/95 p-6 shadow-2xl shadow-indigo-300/50">
            <button
              className="absolute right-4 top-4 rounded-lg px-2 py-1 text-2xl leading-none text-indigo-400 transition hover:bg-indigo-50 hover:text-indigo-700"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="mb-1 text-2xl font-bold text-indigo-950">Create a new post</h2>
            <p className="mb-5 text-sm leading-6 text-indigo-600">Write your title, content, and tags to publish instantly.</p>
            <PostForm
              onPostCreated={() => {
                // closeModal();
                setShowModal(false);
                setRefresh(!refresh);
                onSuccess?.("Post created successfully!");
              }}
            />
          </div>
        </div>
      )}

      {/* <PostForm onPostCreated={()=> setRefresh(!refresh)}/> */}

      {/* Views */}
      {currentView === "all" && (
        <PostList
          key={refresh + "-all"}
          currentUserId={loggedInUserId}
          filterByUser={null}
          onSuccess={onSuccess}
        />
      )}
      {currentView === "profile" && (
        <PostList
          key={refresh + "-profile"}
          currentUserId={loggedInUserId}
          filterByUser={loggedInUserId}
          onSuccess={onSuccess}
        />
      )}

      {/* <PostList key={refresh}/> */}
    </div>
  );
};

export default Home;
