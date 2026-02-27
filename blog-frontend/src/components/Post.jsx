import React from "react";
import API, { toggleUpvote } from "../api/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUpvote } from "react-icons/bi";
import { useEffect } from "react";
import {toast} from "react-toastify"
import { CiMenuKebab } from "react-icons/ci";


const Post = ({ post, isOwner=false, refreshPosts, currentUserId }) => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState(post);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const authorName = postData.author?.name || "Unknown";
  const authorId = postData.author?._id || postData.author;
  const authorIdString = authorId?.toString();
  const canManagePost =
    isOwner ||
    (!!currentUserId && authorIdString === currentUserId?.toString());
  const createdDate = new Date(postData.createdAt);
  const authorInitial = authorName.charAt(0).toUpperCase();
  const hasUpvoted = (postData.upvotes || []).some(
    (id) => id?.toString() === currentUserId?.toString()
  );

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/${postData._id}`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
    fetchComments();
  }, [postData._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if(!commentText.trim()){
      return;
    }
    try{
      if(!currentUserId){
        toast.error("You must be logged in to comment.")

        return;
      }
      const res = await API.post('/comments', {
        postId: postData._id,
        text: commentText
    })
    setComments((prev) => [res.data, ...prev]);
    setCommentText("");
    toast.success("Comment posted successfully!")
    }catch(err){
      console.error("Failed to submit comment", err);
      toast.error("Failed to post comment. Please try again.")
    }
  }


  const handleUpvote = async () => {
    if (isUpvoting) {
      return;
    }

    try {
      if(!currentUserId){
        toast.error("You must be logged in to upvote.")

        return;
      }
      setIsUpvoting(true);
      const res = await toggleUpvote(postData.id || postData._id);
      setPostData((prev) => ({
        ...prev,
        upvotes: res.data.upvotes || prev.upvotes || [],
      }));
      toast.success(res.data.upvoted ? "Post upvoted!" : "Upvote removed!")
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

    if(!window.confirm("Are you sure you want to delete this post?")){
      return;
    }
    try{
      setIsDeleting(true);
      await API.delete(`/posts/${postData._id}`);
      toast.success("Post deleted successfully");
      if (typeof refreshPosts === "function") {
        refreshPosts(postData._id);
      }
    }catch(err){
      console.error("Failed to delete post", err);
      toast.error("Failed to delete post. Please try again.")
    } finally {
      setIsDeleting(false);
    }
  }

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

  const handleUpdatePost = async (updatedPostData) => {
    navigate(`/update-post/${postData._id}`, { state: { post: updatedPostData } });
  }


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
    <article className="overflow-hidden rounded-3xl border border-indigo-200/90 bg-[#E7E7E7] shadow-md shadow-indigo-200/70 transition hover:-translate-y-0.5 hover:shadow-lg">
      <header className="flex justify-between items-center gap-3 border-b border-indigo-100 px-5 py-4">
        <div className="flex  gap-3">
          <>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-semibold text-white">
          {authorInitial}
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/profile/${authorId}`} className="truncate text-sm font-semibold text-indigo-950">
          {authorName}
          </Link>
          <p className="text-xs text-indigo-500">
            {formatTimeAgo(createdDate)}
            <span className="mx-1">•</span>
            {createdDate.toLocaleString()}
          </p>
        </div>
        </>
        </div>
        <div className="relative">
          {canManagePost && (
            <>
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="rounded-full p-1 transition duration-150 hover:bg-indigo-100 cursor-pointer text-black"
              >
                <CiMenuKebab className="w-5 h-5" />
              </button>

              <div
                className={`${showMenu ? "flex" : "hidden"} flex-col transition duration-200 absolute right-0 top-8 z-20 gap-2 rounded-lg border border-indigo-200 bg-white p-2 shadow-lg`}
              >
                <button
                  type="button"
                  disabled={isDeleting}
                  className={`rounded px-3 py-1 text-sm font-medium text-white transition ${isDeleting ? "cursor-not-allowed bg-yellow-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  onClick={() => {
                    setShowMenu(false);
                    handleUpdatePost(postData._id);
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  className={`rounded px-3 py-1 text-sm font-medium text-white transition ${isDeleting ? "cursor-not-allowed bg-red-300" : "bg-red-500 hover:bg-red-600"}`}
                  onClick={() => {
                    handleDeletePost();
                    setShowMenu(false);
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
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
            type="button"
            onClick={handleUpvote}
            disabled={!currentUserId || isUpvoting}
            className={`rounded-full px-3 py-1.5 font-medium flex items-center gap-1.5 transition text-lg ${hasUpvoted ? "text-red-600" : "text-indigo-700"} ${!currentUserId || isUpvoting ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-indigo-100 hover:text-red-600"}`}
          >
            <BiUpvote />
            {(postData.upvotes || []).length}
          </button>
          <button  onClick={()=> setShowCommentBox(!showCommentBox)} className="cursor-pointer font-medium transition hover:text-indigo-900">
            💬 Comment
          </button>
        </div>
        <button
          type="button"
          onClick={handleSharePost}
          disabled={isSharing}
          className={`rounded-full px-3 py-1.5 font-medium transition ${isSharing ? "cursor-not-allowed opacity-60" : "hover:bg-indigo-100 hover:text-indigo-900"}`}
        >
          ↗ Share
        </button>
      </div>

      <div className="px-5 py-4">
        <form onSubmit={handleCommentSubmit} className={`${showCommentBox ? "flex" : "hidden"} items-center gap-2`}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Post
          </button>
        </form>
        <div className="px-5 py-3 space-y-2">
          {
            comments.length === 0 && (
              <p className="text-sm text-indigo-500">No comments yet. Be the first to comment!</p>
            )
          }
          {
            comments.map((comment) => (
              <div key={comment._id} className="border border-indigo-100 rounded-lg px-4 py-2">
               <Link to={`/profile/${comment.user?._id}`} className="text-sm font-semibold text-indigo-900">{comment.user?.name || "Unknown"}</Link>
                <p className="text-sm text-indigo-700">{comment.text}</p>
                <p className="text-xs text-indigo-500">{formatTimeAgo(new Date(comment.createdAt))}</p>
              </div>
             )
            )
          }
        </div>
      </div>
    </article>
  );
};

export default Post;
