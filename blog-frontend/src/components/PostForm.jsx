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
    <form className="max-w-3xl mx-auto p-4 mb-8" onSubmit={handleSubmit}>
      <input
        className="w-full border p-2 mb-2 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border mb-2 p-2 rounded"
      ></textarea>
      <input
        type="text"
        placeholder="Tages (space seperated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Create Post
      </button>
    </form>
  );
};

export default PostForm;
