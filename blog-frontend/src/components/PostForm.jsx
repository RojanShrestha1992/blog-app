import React, { useState } from "react";
import { createPost } from "../api/api";

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [tags, setTags] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

        const tagArray = tags.split(" ").filter(tag => tag.trim() !== "")

    try{
        await createPost({title, content, tags: tagArray})

        //reset form
        setTitle("")
        setContent("")
        setTags("")

        //notify parent to refresh post list
        onPostCreated()
    }catch(err){
        console.error("Failed to create post", err)
    }


    }




  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Content</label>
        <textarea
          placeholder="Write your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-40 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        ></textarea>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
        <input
          type="text"
          placeholder="react javascript tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <p className="mt-2 text-xs text-slate-500">Use spaces between each tag.</p>
      </div>

      <button type="submit" className="inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700">
        Publish Post
      </button>
    </form>
  );
};

export default PostForm;
