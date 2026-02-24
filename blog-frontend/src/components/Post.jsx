import React from 'react'

const Post = ({ post }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md" >
      <h2 className='text-2xl font-bold tracking-tight text-slate-900'>{post.title}</h2>
      <p className='mt-3 whitespace-pre-line leading-7 text-slate-700'>{post.content}</p>

      <div className='mt-5 flex flex-wrap items-center gap-2'>
        {(post.tags || []).map((tag) => (
          <span key={tag} className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700'>
            #{tag}
          </span>
        ))}
      </div>

      <div className='mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:text-sm'>
        <span className='font-medium text-slate-700'>By {post.author ? post.author.name : "Unknown"}</span>
        <span className='mx-2 text-slate-300'>•</span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
    </article>
  )
}

export default Post