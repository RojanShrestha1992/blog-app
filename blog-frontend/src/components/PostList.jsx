import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPosts } from '../api/api'
import Post from './Post'
import { toast } from 'react-toastify'

const PAGE_SIZE = 10

const PostSkeleton = () => (
  <article className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/30 dark:ring-1 dark:ring-white/5'>
    {/* header */}
    <div className='flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-700'>
      <div className='h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700' />
      <div className='flex flex-1 flex-col gap-2'>
        <div className='h-3.5 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700' />
        <div className='h-2.5 w-28 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
      </div>
      <div className='h-7 w-7 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
    </div>
    {/* body */}
    <div className='px-4 py-4'>
      {/* title */}
      <div className='h-5 w-2/3 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700' />
      {/* content lines */}
      <div className='mt-4 space-y-2.5'>
        <div className='h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
        <div className='h-3 w-[95%] animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
        <div className='h-3 w-4/5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
        <div className='h-3 w-3/5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
      </div>
      {/* tag chips */}
      <div className='mt-4 flex gap-2'>
        <div className='h-6 w-14 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
        <div className='h-6 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
        <div className='h-6 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800' />
      </div>
    </div>
    {/* image placeholder */}
    <div className='px-4 pb-4'>
      <div className='h-40 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800' />
    </div>
    {/* footer */}
    <div className='flex items-center gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-700'>
      <div className='h-8 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700' />
      <div className='h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700' />
      <div className='h-8 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700' />
    </div>
  </article>
)

const PostList = ({ filterByUser, currentUserId, onEditPost, onCreatePost }) => {
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
    <main className='mx-auto w-full max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8'>
      {!filterByUser && (
        <section className='mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/30 dark:ring-1 dark:ring-white/5'>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => {
                if (!currentUserId) {
                  toast.error('Please login first to create a post.');
                  return;
                }

                onCreatePost?.();
              }}
              className='flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'
            >
              What’s on your mind?
            </button>
            <button
              type='button'
              onClick={() => {
                if (!currentUserId) {
                  toast.error('Please login first to create a post.');
                  return;
                }

                onCreatePost?.();
              }}
              className='rounded-full bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30'
            >
              Post
            </button>
          </div>
        </section>
      )}

      <section className='mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm shadow-slate-200/60 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400'>Feed</p>
        <h1 className='mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50'>{feedTitle}</h1>
        <p className='mt-1.5 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400'>{feedDescription}</p>
      </section>

      {initialLoading && posts.length === 0 ? (
        <div className='space-y-5'>
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400'>
         {filterByUser ? "You haven't posted anything yet." : "No posts yet. Be the first to share something."}
        </div>
      ) : (
        <div className='space-y-4'>
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
            <PostSkeleton />
          )}

          {hasMore && <div ref={observerTargetRef} className='h-1' aria-hidden='true' />}
        </div>
      )}
    </main>
  )
}

export default PostList