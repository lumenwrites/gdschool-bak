import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter' // Parse front-matter from a string or file
// Plugins
import rehypeSlug from 'rehype-slug' // adds id's to headers so you could link to them
import rehypeCodeTitles from 'rehype-code-titles' // allows you to show folder names above code blocks
import rehypeAutolinkHeadings from 'rehype-autolink-headings' // turns headers into links
import rehypePrism from 'rehype-prism-plus' // syntax highlighting, allows you to highlight code lines

export async function renderMDX(text) {
  const { data: frontmatter, content } = matter(text)
  let remarkPlugins = []
  let rehypePlugins = [
    rehypeSlug,
    rehypeCodeTitles,
    rehypePrism,
    [rehypeAutolinkHeadings, { properties: { className: ['header-link'] } }],
  ]
  const serialized = await serialize(content, {
    mdxOptions: { remarkPlugins, rehypePlugins },
    scope: frontmatter
  })
  return serialized
}
