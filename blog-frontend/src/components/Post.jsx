import React, { useEffect, useState } from "react";
import API, { toggleUpvote } from "../api/api";
import { Link } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { toast } from "react-toastify";
import { CiMenuKebab } from "react-icons/ci";
import { FiEdit2, FiShare2, FiTrash2 } from "react-icons/fi";

const Post = ({ post, isOwner = false, refreshPosts, currentUserId, onEditPost }) => {
  const [postData, setPostData] = useState(post);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const authorName = postData.author?.name || "Unknown";
  const authorAvatar = postData.author?.avatar || "";
  const authorId = postData.author?._id || postData.author;
  const authorIdString = authorId?.toString();
  const canManagePost = isOwner || (!!currentUserId && authorIdString === currentUserId?.toString());
  const createdDate = new Date(postData.createdAt);
  const authorInitial = authorName.charAt(0).toUpperCase();
  const hasUpvoted = (postData.upvotes || []).some((id) => id?.toString() === currentUserId?.toString());

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/${postData._id}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setComments([]);
      }
    };

    fetchComments();
  }, [postData._id]);

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      if (!currentUserId) {
        toast.error("You must be logged in to comment.");
        return;
      }

      const res = await API.post("/comments", {
        postId: postData._id,
        text: commentText,
      });

      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      console.error("Failed to submit comment", err);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const handleUpvote = async () => {
    if (isUpvoting) {
      return;
    }

    try {
      if (!currentUserId) {
        toast.error("You must be logged in to upvote.");
        return;
      }

      setIsUpvoting(true);
      const res = await toggleUpvote(postData.id || postData._id);
      setPostData((prev) => ({
        ...prev,
        upvotes: res.data.upvotes || prev.upvotes || [],
      }));
      toast.success(res.data.upvoted ? "Post upvoted!" : "Upvote removed!");
    } catch (err) {
      console.error("Failed to toggle upvote", err);
      toast.error("Failed to update upvote. Please try again.");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      await API.delete(`/posts/${postData._id}`);
      toast.success("Post deleted successfully");
      if (typeof refreshPosts === "function") {
        refreshPosts(postData._id);
      }
    } catch (err) {
      console.error("Failed to delete post", err);
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSharePost = async () => {
    if (isSharing) {
      return;
    }

    const shareUrl = `${window.location.origin}/profile/${authorId}`;

    try {
      setIsSharing(true);
      if (navigator.share) {
        await navigator.share({
          title: postData.title,
          text: postData.content,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Profile link copied to clipboard!");
    } catch (err) {
      console.error("Failed to share post", err);
      toast.error("Failed to share. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleUpdatePost = () => {
    if (typeof onEditPost === "function") {
      onEditPost(postData);
    }
  };

  const avatarNode = authorAvatar ? (
    <img src={authorAvatar} alt={authorName} className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
  ) : (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
      {authorInitial}
    </div>
  );

  const commentAvatarNode = (name, avatar) =>
    avatar ? (
      <img src={avatar} alt={name || "Unknown"} className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
    ) : (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-xs font-semibold text-white">
        {(name || "U").charAt(0).toUpperCase()}
      </div>
    );

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/30 dark:ring-1 dark:ring-white/5">
      <header className="relative flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-3">
          {avatarNode}
          <div className="min-w-0">
            <Link to={`/profile/${authorId}`} className="truncate text-sm font-semibold text-slate-900 transition hover:text-indigo-600 dark:text-slate-50 dark:hover:text-indigo-400">
              {authorName}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatTimeAgo(createdDate)}
              <span className="mx-1">•</span>
              {createdDate.toLocaleString()}
            </p>
          </div>
        </div>

        {canManagePost && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Post options"
              title="Post options"
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <CiMenuKebab className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <button
                  type="button"
                  aria-label="Close post menu"
                  className="fixed inset-0 z-30 cursor-default bg-transparent"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-11 z-40 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      handleUpdatePost();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Update post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setConfirmDeleteOpen(true);
                    }}
                    disabled={isDeleting}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete post"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold leading-tight text-slate-950 sm:text-xl dark:text-slate-50">
          {postData.title}
        </h2>
        <p className="mt-2.5 whitespace-pre-line text-[15px] leading-7 text-slate-700 dark:text-slate-300">
          {postData.content}
        </p>

        {(postData.tags || []).length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {(postData.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-indigo-200/80 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {postData.media && (
        <div className="px-4 pb-4">
          {postData.media.match(/\.(mp4|webm|ogg)$/i) ? (
            <video controls autoPlay={false} className="mt-1 max-h-96 w-full rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800">
              <source src={postData.media} />
            </video>
          ) : (
            <img src={postData.media} alt="post" className="mt-1 max-h-96 w-full rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 text-sm dark:border-slate-700">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={handleUpvote}
            disabled={!currentUserId || isUpvoting}
            title={currentUserId ? (hasUpvoted ? "Remove upvote" : "Upvote") : "Sign in to interact"}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${hasUpvoted ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"} ${!currentUserId || isUpvoting ? "cursor-not-allowed opacity-60" : "hover:-translate-y-0.5"}`}
          >
            <BiUpvote className="text-base" />
            {(postData.upvotes || []).length}
          </button>

          <button
            type="button"
            onClick={() => setShowCommentBox((prev) => !prev)}
            title={showCommentBox ? "Hide comments" : "Add a comment"}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${showCommentBox ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"}`}
          >
            💬 Comment
          </button>
        </div>

        <button
          type="button"
          onClick={handleSharePost}
          disabled={isSharing}
          title="Share post"
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 ${isSharing ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <FiShare2 className="h-4 w-4" />
          Share
        </button>
      </div>

      <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-700">
        <form onSubmit={handleCommentSubmit} className={`grid gap-2 transition-all duration-200 ${showCommentBox ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="mt-2 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30"
          >
            Post
          </button>
          </div>
        </form>

        <div className={`mt-3.5 space-y-3 border-l border-slate-200 pl-4 transition-all duration-200 dark:border-slate-700 ${showCommentBox ? "opacity-100" : "opacity-95"}`}>
          {comments.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet. Be the first to comment!</p>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
              <div className="flex items-start gap-3">
                {commentAvatarNode(comment.user?.name, comment.user?.avatar)}
                <div className="min-w-0 flex-1">
                  <Link to={`/profile/${comment.user?._id}`} className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {comment.user?.name || "Unknown"}
                  </Link>
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{comment.text}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{formatTimeAgo(new Date(comment.createdAt))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Delete this post?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              This action cannot be undone. The post and its comments will be removed.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={async () => {
                  setConfirmDeleteOpen(false);
                  await handleDeletePost();
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;