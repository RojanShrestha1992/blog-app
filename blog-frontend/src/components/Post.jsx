import React from "react";
import { toggleUpvote } from "../api/api";
import { useState } from "react";
import { BiUpvote } from "react-icons/bi";

const Post = ({ post }) => {
  console.log("Rendering Post component with post:", post);
  const [postData, setPostData] = useState(post);
  const [upvote, setUpvote] = useState(false);
  const authorName = postData.author?.name || "Unknown";
  const createdDate = new Date(postData.createdAt);
  const authorInitial = authorName.charAt(0).toUpperCase();

  const handleUpvote = async () => {
    try {
      const res = await toggleUpvote(postData.id || postData._id);
      setPostData((prev) => ({
        ...prev,
        upvotes: res.data.upvotes || prev.upvotes || [],
      }));
    } catch (err) {
      console.error("Failed to toggle upvote", err);
    }
  };
  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-indigo-200/90 bg-indigo-50/90 shadow-md shadow-indigo-200/70 transition hover:-translate-y-0.5 hover:shadow-lg">
      <header className="flex items-center gap-3 border-b border-indigo-100 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-semibold text-white">
          {authorInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-indigo-950">
            {authorName}
          </p>
          <p className="text-xs text-indigo-500">
            {formatTimeAgo(createdDate)}
            <span className="mx-1">•</span>
            {createdDate.toLocaleString()}
          </p>
        </div>
      </header>

      <div className="px-5 py-4">
        <h2 className="text-lg font-bold leading-snug text-indigo-950 sm:text-xl">
          {postData.title}
        </h2>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-indigo-900/85">
          {postData.content}
        </p>

        {(postData.tags || []).length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(postData.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-violet-200/80 px-3 py-1 text-xs font-medium text-violet-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {postData.media && (
        <div className="px-5 pb-4">
          {postData.media.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              controls
              className="mt-2 max-h-115 w-full rounded-2xl object-cover ring-1 ring-indigo-100"
            >
              <source src={postData.media} />
            </video>
          ) : (
            <img
              src={postData.media}
              alt="post"
              className="mt-2 max-h-115 w-full rounded-2xl object-cover ring-1 ring-indigo-100"
            />
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-indigo-100 px-5 py-3 text-sm text-indigo-600">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              handleUpvote();
              setUpvote(!upvote);
            }}
            className={`font-medium flex items-center gap-1 transition hover:text-red-600 text-lg cursor-pointer ${upvote ? "text-red-600" : ""}`}
          >
            <BiUpvote />
            {(postData.upvotes || []).length}
          </button>
          <button className="cursor-pointer font-medium transition hover:text-indigo-900">
            💬 Comment
          </button>
        </div>
        <button className="font-medium transition hover:text-indigo-900">
          ↗ Share
        </button>
      </div>
    </article>
  );
};

export default Post;
