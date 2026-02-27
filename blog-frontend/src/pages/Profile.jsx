import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API, { fetchProfile, getCurrentUser } from "../api/api";
import Navbar from "../components/Navbar";
import Post from "../components/Post";

const Profile = ({ loggedInUser: appUser, onLogout }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

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
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 pb-10">
      <Navbar onNavClick={handleNavClick} user={loggedInUser} onLogout={handleLogout} />

      <div className="relative h-40 bg-linear-to-r from-indigo-600 to-violet-600"></div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-16 bg-white rounded-3xl shadow-xl p-6 text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>

          <div className="mt-6 flex justify-center gap-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats?.totalPosts || 0}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{stats?.totalUpvotes || 0}</p>
              <p className="text-sm text-gray-500">Upvotes</p>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">{user?.name}'s Posts</h2>

          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow">No posts yet.</div>
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
