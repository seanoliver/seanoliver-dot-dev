import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import { mdxComponents } from '@/components/mdx'

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  // Find post for current page
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  // 404 if the post does not exist.
  if (!post) notFound()

  return { title: post.title }
}

const PostLayout = ({ params }: { params: { slug: string } }) => {
  // Find post for current page
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  // 404 if the post does not exist.
  if (!post) notFound()

  // Parse the MDX file via the useMDXComponent hook.
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <div className="text-sm w-full my-10 md:my-20">
      {/* Post Header */}
      <div>
        {/* Title */}
        <h1 className="tescroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {post.title}
        </h1>

        {/* Byline */}
        <p className="text-md text-muted-foreground mt-3 mb-10">
          By {post.author} · {format(parseISO(post.date), 'LLLL d, yyyy')}
          {' · '}
          {process.env.NODE_ENV === 'development' && !post.isPublished && (
            <span className="text-md font-semibold text-red-600">Unpublished</span>
          )}
        </p>
      </div>
      {/* Post Content */}
      <div className="mx-auto">
        <MDXContent components={mdxComponents} />
      </div>
    </div>
  )
}

export default PostLayout
