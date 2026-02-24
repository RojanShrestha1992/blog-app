import React from 'react'

const Post = ({ post }) => {
  return (
    <div className="border p-4 rounded mb-4 shadow-sm" >
        <h2 className='text-xl font-semibold'>{post.title}</h2>
        <p className='text-gray-700 mt-2'>{post.content}</p>
        <p className='text-sm text-gray-500 mt-2'>
            Author: {post.author ? post.author.name : "Unknown"} | Created At: {new Date(post.createdAt).toLocaleString()} | Tags: {post.tags.join(", ")}
        </p>
        </div>
  )
}

export default Post