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
    <main className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6'>
      <section className='mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900'>{filterByUser ? "My Posts" : "Latest Posts"}</h1>
        <p className='mt-2 text-sm text-slate-600'>
          {filterByUser ? "Posts you have published recently." : "Discover ideas, stories, and updates from the community."}
        </p>
      </section>

      {posts.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600'>
          No posts found yet.
        </div>
      ) : (
        <div className='space-y-5'>
          {
            posts.map((post)=>(
              <Post key={post._id} post={post} currentUserId={currentUserId} />
            ))
          }
        </div>
      )}
    </main>
  )
}

export default PostList