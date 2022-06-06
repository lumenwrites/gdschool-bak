import { useRouter } from 'next/router'
import Link from 'components/Elements/Link'

export default function Sidebar({ toc }) {
  return (
    <div className="Sidebar">
      {toc.map((section) => (
        <Section key={section.slug} section={section} />
      ))}
    </div>
  )
}

function Section({ section }) {
  return (
    <div className="section">
      <div className="section-title">{section.title}</div>
      {section.lessons.map((lesson) => (
        <LessonLink lesson={lesson} section={section} />
      ))}
    </div>
  )
}

function LessonLink({ lesson, section }) {
  const router = useRouter()
  const [courseSlug, sectionSlug, lessonSlug] = router.query.slug as string[]
  const isActive = section.slug === sectionSlug && lesson.slug === lessonSlug
  return (
    <Link
      key={lesson.url}
      className={`lesson ${isActive ? '-active' : ''}`}
      href={lesson.url}
    >
      {lesson.title}
      {lesson.draft && <div className="draft">Draft</div>}
      {lesson.preview && <div className="preview">Free Preview</div>}
    </Link>
  )
}
