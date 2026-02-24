import React, { useEffect, useState } from 'react'
import { fetchPosts } from '../api/api'
import Post from './Post'


const PostList = ({ filterByUser, currentUserId }) => {
  const [posts, setPosts] = useState([])



  useEffect(()=>{
    console.log("filterbyuser in postlist", filterByUser)
    const loadPosts = async () =>{
      try{
        const {data} = await fetchPosts()
        if(filterByUser){
          setPosts(data.filter((post)=> post.author?._id.toString() === filterByUser.toString()))
        }else{

          setPosts(data)
        }
      }catch(err){
        console.error("Failed to fetch posts", err)
      }
    }
    loadPosts()
  }, [filterByUser])

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>{filterByUser ? "My Posts" : "All Posts"}</h1>
      {
        posts.map((post)=>(
          <Post key={post._id} post={post} currentUserId={currentUserId} />
        ))
      }
    </div>
  )
}

export default PostList