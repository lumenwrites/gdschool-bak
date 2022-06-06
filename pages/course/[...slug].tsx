import { MDXRemote } from 'next-mdx-remote'
import MDXComponents from 'components/Elements/MDXComponents'

export default function LessonPage({ lesson }) {
  return (
    <div>
      <div className="Lesson prose">
        <MDXRemote {...lesson.serializedMDX} components={MDXComponents} />
      </div>
    </div>
  )
}

import courses from 'content/json/courses.json'

export async function getServerSideProps({ params, req }) {
  const [courseSlug, sectionSlug, chapterSlug] = params.slug
  const course = courses[courseSlug]
  console.log('[...slug]', courseSlug)
  const lesson = course.sections[0].lessons[0]
  return { props: { lesson } }
}
