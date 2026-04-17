import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API, { fetchProfile, getCurrentUser, uploadAvatar } from "../api/api";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { toast } from "react-toastify";

const Profile = ({ loggedInUser: appUser, onLogout }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await fetchProfile(userId);
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    loadProfile();
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (appUser) {
        setLoggedInUser(appUser);
        return;
      }
      const loggedInUser = await getCurrentUser();
      if (loggedInUser) {
        setLoggedInUser(loggedInUser);
      }
    };
    fetchUser();
  }, [appUser]);

  const handleNavClick = (view) => {
    if (view === "all") {
      navigate("/");
      return;
    }

    if (view === "create") {
      navigate("/", { state: { openCreateModal: true } });
      return;
    }

    if (view === "profile" && loggedInUser?._id) {
      navigate(`/profile/${loggedInUser._id}`);
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      navigate("/");
      return;
    }

    await API.post("/auth/logout", {}, { withCredentials: true });
    setLoggedInUser(null);
    navigate("/login");
  };

  const { user, posts = [], stats } = profileData || {};
  const isOwnProfile = user?._id?.toString() === loggedInUser?._id?.toString();

  const handleAvatarUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const { data } = await uploadAvatar(formData);

      setProfileData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            avatar: data.avatar,
          },
        };
      });

      setLoggedInUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar: data.avatar,
        };
      });

      toast.success("Profile picture updated");
    } catch (err) {
      console.error("Failed to upload avatar", err);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const avatar = user?.avatar ? (
    <img
      src={user.avatar}
      alt={user?.name || "Profile"}
      className="mx-auto h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-slate-950"
    />
  ) : (
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-slate-950">
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent pb-10">
      <Navbar onNavClick={handleNavClick} user={loggedInUser} onLogout={handleLogout} />

      <div className="relative h-36 bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/30 dark:ring-1 dark:ring-white/5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-r from-indigo-500/10 via-cyan-500/10 to-transparent" />
          <div className="relative text-center">
            {avatar}

            {isOwnProfile && (
              <div className="mt-3">
                <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900">
                  {isUploadingAvatar ? "Uploading..." : "Change photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingAvatar}
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
            )}

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{user?.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mx-auto sm:max-w-md">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{stats?.totalPosts || 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Posts</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{stats?.totalUpvotes || 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upvotes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{user?.name}'s Posts</h2>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-9 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">No posts yet.</div>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                isOwner={(post.author?._id || post.author)?.toString() === loggedInUser?._id?.toString()}
                currentUserId={loggedInUser?._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;