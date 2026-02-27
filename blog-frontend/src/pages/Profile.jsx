import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProfile, getCurrentUser } from "../api/api";
import Post from "../components/Post";

const Profile = () => {
  const { userId } = useParams();
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
      const loggedInUser = await getCurrentUser();
      if (loggedInUser) {
        setLoggedInUser(loggedInUser);
      }
    };
    fetchUser();
  }, []);

  const { user, posts = [], stats } = profileData || {};
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      {/* User Card */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-indigo-500">{user?.email}</p>

        <div className="flex gap-6 mt-4">
          <div>
            <p className="font-bold text-lg">{stats?.totalPosts}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-bold text-lg">{stats?.totalUpvotes}</p>
            <p className="text-sm text-gray-500">Upvotes</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          isOwner={(post.author?._id || post.author)?.toString() === loggedInUser?._id?.toString()}
          currentUserId={loggedInUser?._id}
        />
      ))}
    </div>
  );
};

export default Profile;
