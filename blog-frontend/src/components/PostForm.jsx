import React, { useState } from "react";
import { createPost, updatePost } from "../api/api";
import { useEffect } from "react";

const PostForm = ({ onPostCreated, mode = "create", initialPost = null }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit" && Boolean(initialPost?._id);

  useEffect(() => {
    if (isEditMode) {
      setTitle(initialPost?.title || "");
      setContent(initialPost?.content || "");
      setTags(Array.isArray(initialPost?.tags) ? initialPost.tags.join(" ") : "");
      setFile(null);
      return;
    }

    setTitle("");
    setContent("");
    setTags("");
    setFile(null);
  }, [initialPost, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const tagArray = tags.split(" ").filter((tag) => tag.trim() !== "");

    try {
      setIsSubmitting(true);

      if (isEditMode) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("tags", JSON.stringify(tagArray));
        if (file) {
          formData.append("media", file);
        }

        const response = await updatePost(initialPost._id, formData);
        onPostCreated(response.data);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tagArray));
      if (file) {
        formData.append("media", file);
      }

      await createPost(formData);

      setTitle("");
      setContent("");
      setTags("");
      setFile(null);

      onPostCreated();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} post`, err);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Content</label>
        <textarea
          placeholder="Write your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-44 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        ></textarea>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Media</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-100 dark:hover:file:bg-slate-700"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Images and short videos are supported.</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tags</label>
        <input
          type="text"
          placeholder="react javascript tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Use spaces between each tag.</p>
      </div>

      <button type="submit" className="inline-flex rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30">
        {isSubmitting ? (isEditMode ? "Updating..." : "Publishing...") : isEditMode ? "Update Post" : "Publish Post"}
      </button>
    </form>
  );
};

export default PostForm;
