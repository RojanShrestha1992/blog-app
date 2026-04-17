import React, { useEffect, useState } from "react";
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
      openCreateModal();
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

  const openCreateModal = () => {
    setModalMode("create");
    setEditingPost(null);
    setShowModal(true);
  };

  const handlePostSaved = () => {
    setShowModal(false);
    setEditingPost(null);
    setModalMode("create");
    setRefresh((value) => !value);
    toast.success(isEditMode ? "Post updated successfully!" : "Post created successfully!");
  };

  return (
    <div className="min-h-screen bg-transparent pb-8">
      <Navbar onNavClick={handleNavClick} user={loggedInUser} onLogout={onLogout} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <button
              className="absolute right-4 top-4 rounded-full px-3 py-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="mb-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {isEditMode ? "Update post" : "Create a new post"}
            </h2>
            <p className="mb-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {isEditMode
                ? "Refine your title, content, media, and tags before saving."
                : "Compose a clear post with tags and optional media, then publish it."}
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <PostForm
                mode={isEditMode ? "edit" : "create"}
                initialPost={editingPost}
                onPostCreated={handlePostSaved}
              />
            </div>
          </div>
        </div>
      )}

      {currentView === "all" && (
        <PostList
          key={refresh + "-all"}
          currentUserId={loggedInUserId}
          filterByUser={null}
          onCreatePost={openCreateModal}
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