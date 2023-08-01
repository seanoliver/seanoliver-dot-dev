import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    isPublished: {
      type: 'boolean',
      description: 'Whether the post is published',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
    author: {
      type: 'string',
      resolve: () => 'Sean Oliver',
    },
  },
}))

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: 'poimandres',
}

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, options]],
  },
})
