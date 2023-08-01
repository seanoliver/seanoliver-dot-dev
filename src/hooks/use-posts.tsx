import { useState, useEffect } from 'react'
import { allPosts, type Post } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>()

  const sortPosts = (posts: Post[]): Post[] =>
    posts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  useEffect(() => {
    const filteredPosts =
      process.env.NODE_ENV === 'development'
        ? allPosts
        : allPosts.filter((post) => post.isPublished)

    setPosts(sortPosts(filteredPosts))
  }, [])

  return posts
}
