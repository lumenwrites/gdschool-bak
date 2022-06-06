import Header from 'components/Layout/Header'
import Sidebar from 'components/Courses/Sidebar'
import Lesson from 'components/Courses/Lesson'

export default function LessonPage({ lesson, toc }) {
  return (
    <>
      <Header />
      <div className="CourseLayout">
        <Sidebar toc={toc} />
        <Lesson lesson={lesson} />
      </div>
    </>
  )
}

import courses from 'content/json/courses.json'

export async function getServerSideProps({ params, req }) {
  const [courseSlug, sectionSlug, chapterSlug] = params.slug
  const course = courses[courseSlug]
  const { toc, sections } = course
  const lesson = sections[0].lessons[0]
  console.log('[...slug]', courseSlug)
  return { props: { lesson, toc } }
}
