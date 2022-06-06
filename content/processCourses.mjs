import fs from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'
import { renderMDX } from './renderMdx.mjs'
import { saveJson, readText, slugify, ensureDirExists } from './utils.mjs'

const coursesDir = './courses'
const jsonDir = path.join(process.cwd(), './content/json')
const isProd = process.env.NODE_ENV === 'production'

export async function processCourses() {
  console.log('[processCourses] Converting markdown courses to json...')
  let courses = {} // A huge object containing all the courses
  // Loop through the folders containing courses.
  for (const courseDirName of fs.readdirSync(coursesDir)) {
    if (!fs.lstatSync(`${coursesDir}/${courseDirName}`).isDirectory()) continue // ignore files, like .DS_Store
    const course = await processCourse(courseDirName)
    courses[course.slug] = course
  }
  // Save courses to a json file
  saveJson(`${jsonDir}/courses.json`, courses)
  console.log('[processCourses] Success! Markdown courses converted to json.')
}

async function processCourse(courseDirName) {
  console.log('Processing course:', courseDirName)
  const contentDirPath = `${coursesDir}/${courseDirName}/content`
  const courseIndexText = readText(`${contentDirPath}/_index.md`)
  const { data: courseFrontmatter } = matter(courseIndexText)
  let course = {
    title: courseFrontmatter.title,
    slug: courseFrontmatter.slug || slugify(courseFrontmatter.title),
    description: courseFrontmatter.description,
    thumbnail: courseFrontmatter.thumbnail,
    draft: courseFrontmatter.draft || false,
    price: courseFrontmatter.price || 0,
    tags: courseFrontmatter.tags || [],
    sections: [],
    toc: [],
  }
  // Loop through course sections
  for (const sectionDirName of fs.readdirSync(contentDirPath)) {
    let section = await processSection(sectionDirName, contentDirPath, course)
    if (section) course.sections.push(section)
  }
  generatePrevNextLinks(course.sections)
  course.toc = generateTOC(course.sections)
  course.firstLessonUrl = `/course/${course.slug}/${course.toc[0].slug}/${course.toc[0].lessons[0].slug}`
  return course
}

async function processSection(sectionDirName, contentDirPath, course) {
  const sectionDirPath = `${contentDirPath}/${sectionDirName}`
  if (!fs.lstatSync(sectionDirPath).isDirectory()) return // ignore files
  console.log('Processing section:', sectionDirName)
  // Get section metadata from _index.md file inside its folder
  const sectionIndexText = readText(`${sectionDirPath}/_index.md`)
  const { data: sectionFrontmatter } = matter(sectionIndexText)
  let section = {
    title: sectionFrontmatter.title,
    slug: sectionFrontmatter.slug || slugify(sectionFrontmatter.title),
    draft: sectionFrontmatter.draft || false,
    lessons: [],
  }
  for (const lessonFilename of fs.readdirSync(sectionDirPath)) {
    let lesson = await processLesson(
      lessonFilename,
      sectionDirPath,
      course,
      section
    )
    if (lesson) section.lessons.push(lesson)
  }
  // Don't add section to the course if there are no lessons in it (like if all of them are drafts)
  if (!section.lessons.length) return

  // Copy images
  const imagesPath = `./public/courses/${course.slug}/${section.slug}/images`
  ensureDirExists(imagesPath)
  fs.copy(`${sectionDirPath}/images`, imagesPath)
  
  return section
}

async function processLesson(lessonFilename, sectionDirPath, course, section) {
  const lessonFilePath = `${sectionDirPath}/${lessonFilename}`
  if (fs.lstatSync(lessonFilePath).isDirectory()) return // ignore directories
  if (lessonFilename == '_index.md') return
  if (lessonFilename == '.DS_Store') return
  console.log('Processing lesson', lessonFilename)

  const lessonText = readText(lessonFilePath)
  const { data: lessonFrontmatter, content } = matter(lessonText)
  if (isProd && lessonFrontmatter.draft) return // skip drafts in production
  let lesson = {
    title: lessonFrontmatter.title,
    slug: lessonFrontmatter.slug || slugify(lessonFrontmatter.title),
    free: lessonFrontmatter.free || false,
    draft: lessonFrontmatter.draft || false,
    url: '',
    serializedMDX: await renderMDX(lessonText),
  }
  lesson.url = `/course/${course.slug}/${section.slug}/${lessonFrontmatter.slug}` // used in prev-next and TOC
  return lesson
}

function generatePrevNextLinks(sections) {
  for (const [sectionIndex, section] of sections.entries()) {
    for (const [lessonIndex, lesson] of section.lessons.entries()) {
      let prevLesson = section.lessons[lessonIndex - 1] || null
      let nextLesson = section.lessons[lessonIndex + 1] || null
      // Next/prev button between sections
      // If this is the first lesson, but not the first section
      if (!prevLesson && sectionIndex > 0) {
        const prevSection = sections[sectionIndex - 1]
        prevLesson = prevSection.lessons[prevSection.lessons.length - 1]
      }
      // If this is the last lesson, but not the last section
      if (!nextLesson && sectionIndex < sections.length - 1) {
        const nextSection = sections[sectionIndex + 1]
        nextLesson = nextSection.lessons[0]
      }
      lesson.prev = null
      if (prevLesson) {
        lesson.prev = { title: prevLesson.title, url: prevLesson.url }
      }
      lesson.next = null
      if (nextLesson) {
        lesson.next = { title: nextLesson.title, url: nextLesson.url }
      }
    }
  }
}

function generateTOC(sections) {
  const toc = sections.map((section) => {
    return {
      title: section.title,
      slug: section.slug, //for "key" prop
      lessons: section.lessons.map((lesson) => {
        return {
          title: lesson.title,
          slug: lesson.slug, // for "active" lesson
          url: lesson.url,
          draft: lesson.draft,
          free: lesson.free, // for "free preview" tag
        }
      }),
    }
  })
  return toc
}
