import { MDXRemote } from 'next-mdx-remote'
import MDXComponents from 'components/Elements/MDXComponents'

export default function Lesson({ lesson }) {
  return (
    <div className="Lesson">
      <div className="prose">
        <MDXRemote {...lesson.serializedMDX} components={MDXComponents} />
      </div>
    </div>
  )
}
