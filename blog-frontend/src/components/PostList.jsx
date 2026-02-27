import React, { useEffect, useState } from 'react'
import { fetchPosts } from '../api/api'
import Post from './Post'


const PostList = ({ filterByUser, currentUserId }) => {
  const [posts, setPosts] = useState([])

  const refreshPosts = (deletedPostId) => {
    setPosts((prev) => prev.filter((item) => item._id !== deletedPostId));
  };

  const feedTitle = filterByUser ? 'My Posts' : 'Home Feed'
  const feedDescription = filterByUser
    ? 'Everything you have posted in one place.'
    : 'Fresh updates from the community.'

  useEffect(()=>{
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
    <main className='mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6'>
      <section className='mb-6 rounded-3xl border border-indigo-200/90 bg-indigo-50/85 px-5 py-5 shadow-lg shadow-indigo-200/70 backdrop-blur-sm'>
        <h1 className='text-xl font-bold text-indigo-950 sm:text-2xl'>{feedTitle}</h1>
        <p className='mt-1 text-sm leading-6 text-indigo-600'>{feedDescription}</p>
      </section>

      {posts.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-indigo-300 bg-indigo-50/80 p-12 text-center text-indigo-700 shadow-sm'>
         {filterByUser ? "You haven't posted anything yet." : "No posts yet. Be the first to share something."}
        </div>
      ) : (
        <div className='space-y-5'>
          {
            posts.map((post)=>(
              <Post
                isOwner={post.author?._id?.toString() === currentUserId?.toString()}
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                refreshPosts={refreshPosts}
              />
            ))
          }
        </div>
      )}
    </main>
  )
}

export default PostList