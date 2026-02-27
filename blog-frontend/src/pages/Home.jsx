import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Home = ({ loggedInUser, onLogout }) => {
  const [refresh, setRefresh] = useState(false);
  const [currentView, setCurrentView] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingPost, setEditingPost] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUserId = loggedInUser?._id ?? null;

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setTimeout(() => setShowModal(true), 0);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleNavClick = (view) => {
    if (view === "create") {
      setModalMode("create");
      setEditingPost(null);
      setShowModal(true);
    } else {
      setCurrentView(view);
    }
  };
  const handleEditPost = (post) => {
    setEditingPost(post);
    setModalMode("edit");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setModalMode("create");
  };

  const isEditMode = modalMode === "edit" && Boolean(editingPost?._id);
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar onNavClick={handleNavClick} user={loggedInUser} onLogout={onLogout} />

      {/* modal for creating post */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/55 p-4 backdrop-blur-md">
          <div className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-indigo-200/90 bg-indigo-50/95 p-6 shadow-2xl shadow-indigo-300/50">
            <button
              className="absolute right-4 top-4 rounded-lg px-2 py-1 text-2xl leading-none text-indigo-400 transition hover:bg-indigo-50 hover:text-indigo-700"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="mb-1 text-2xl font-bold text-indigo-950">
              {isEditMode ? "Update post" : "Create a new post"}
            </h2>
            <p className="mb-5 text-sm leading-6 text-indigo-600">
              {isEditMode
                ? "Edit your title, content, media, and tags to save changes."
                : "Write your title, content, and tags to publish instantly."}
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <PostForm 
                mode={isEditMode ? "edit" : "create"}
                initialPost={editingPost}
                onPostCreated={() => {
                  setShowModal(false);
                  setEditingPost(null);
                  setModalMode("create");
                  setRefresh(!refresh);
                  toast.success(isEditMode ? "Post updated successfully!" : "Post created successfully!");
                }}
              />
            </div>
          </div>
        </div>
      )}


      {/* Views */}
      {currentView === "all" && (
        <PostList
          key={refresh + "-all"}
          currentUserId={loggedInUserId}
          filterByUser={null}
          onEditPost={handleEditPost}
        />
      )}
      {currentView === "profile" && (
        <PostList
          key={refresh + "-profile"}
          currentUserId={loggedInUserId}
          filterByUser={loggedInUserId}
          onEditPost={handleEditPost}
        />
      )}

    </div>
  );
};

export default Home;
