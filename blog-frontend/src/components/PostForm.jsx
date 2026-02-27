import React, { useState } from "react";
import { createPost } from "../api/api";

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const [tags, setTags] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

        const tagArray = tags.split(" ").filter(tag => tag.trim() !== "")

    try{
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tagArray));
      if (file) {
        formData.append("media", file);
      }

      await createPost(formData)

        //reset form
        setTitle("")
        setContent("")
        setTags("")
        setFile(null)

        //notify parent to refresh post list
        onPostCreated()
    }catch(err){
        console.error("Failed to create post", err)
    }


    }




  return (
    <form className="space-y-5 " onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium text-indigo-800">Title</label>
        <input
          className="w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-indigo-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-indigo-800">Content</label>
        <textarea
          placeholder="Write your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-40 w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-indigo-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        ></textarea>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-indigo-800">Media</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className="w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 p-2.5 text-indigo-900 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-800 hover:file:bg-indigo-300"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-indigo-800">Tags</label>
        <input
          type="text"
          placeholder="react javascript tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-2xl border border-indigo-300 bg-indigo-100/70 px-4 py-3 text-indigo-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-2 text-xs text-indigo-500">Use spaces between each tag.</p>
      </div>

      <button type="submit" className="inline-flex rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700">
        Publish Post
      </button>
    </form>
  );
};

export default PostForm;
