import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPosts } from '../api/api'
import Post from './Post'

const PAGE_SIZE = 10

const PostList = ({ filterByUser, currentUserId, onEditPost }) => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerTargetRef = useRef(null)
  const isFetchingRef = useRef(false)

  const refreshPosts = (deletedPostId) => {
    setPosts((prev) => prev.filter((item) => item._id !== deletedPostId));
  };

  const feedTitle = filterByUser ? 'My Posts' : 'Home Feed'
  const feedDescription = filterByUser
    ? 'Everything you have posted in one place.'
    : 'Fresh updates from the community.'

  const loadPosts = useCallback(async (targetPage, { replace = false } = {}) => {
    if (isFetchingRef.current) return

    isFetchingRef.current = true
    if (replace) {
      setInitialLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const params = {
        page: targetPage,
        limit: PAGE_SIZE,
        ...(filterByUser ? { author: filterByUser } : {}),
      }
      const { data } = await fetchPosts(params)
      const safePosts = Array.isArray(data?.posts)
        ? data.posts
        : Array.isArray(data)
          ? data
          : []
      const totalPages = Number(data?.pagination?.totalPages) || null

      setPosts((prev) => {
        if (replace) return safePosts

        const existingIds = new Set(prev.map((item) => item._id))
        const incomingPosts = safePosts.filter((item) => !existingIds.has(item._id))
        return [...prev, ...incomingPosts]
      })

      setPage(targetPage)
      if (totalPages !== null) {
        setHasMore(targetPage < totalPages)
      } else {
        setHasMore(safePosts.length === PAGE_SIZE)
      }
    } catch (err) {
      console.error('Failed to fetch posts', err)
      if (replace) {
        setPosts([])
      }
      setHasMore(false)
    } finally {
      isFetchingRef.current = false
      setInitialLoading(false)
      setLoadingMore(false)
    }
  }, [filterByUser])

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    setInitialLoading(true)
    setLoadingMore(false)

    loadPosts(1, { replace: true })
  }, [filterByUser, loadPosts])

  useEffect(() => {
    const target = observerTargetRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isFetchingRef.current) {
          loadPosts(page + 1)
        }
      },
      {
        root: null,
        rootMargin: '250px 0px',
        threshold: 0.1,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, page, loadPosts])

  return (
    <main className='mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6'>
      <section className='mb-6 rounded-3xl border border-indigo-200/90 bg-indigo-50/85 px-5 py-5 shadow-lg shadow-indigo-200/70 backdrop-blur-sm'>
        <h1 className='text-xl font-bold text-indigo-950 sm:text-2xl'>{feedTitle}</h1>
        <p className='mt-1 text-sm leading-6 text-indigo-600'>{feedDescription}</p>
      </section>

      {initialLoading && posts.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-indigo-300 bg-indigo-50/80 p-12 text-center text-indigo-700 shadow-sm'>
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
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
                onEditPost={onEditPost}
              />
            ))
          }

          {loadingMore && (
            <div className='rounded-3xl border border-indigo-200 bg-indigo-50/85 p-4 text-center text-sm text-indigo-700 shadow-sm'>
              Loading more posts...
            </div>
          )}

          {hasMore && <div ref={observerTargetRef} className='h-1' aria-hidden='true' />}
        </div>
      )}
    </main>
  )
}

export default PostList