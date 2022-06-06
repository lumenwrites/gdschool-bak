import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { saveJson, readText } from './utils.mjs'

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
    courses[courseDirName] = course
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
    slug: courseFrontmatter.slug,
    description: courseFrontmatter.description,
    thumbnail: courseFrontmatter.thumbnail,
    draft: courseFrontmatter.draft,
    price: courseFrontmatter.price,
    tags: courseFrontmatter.tags,
    sections: []
  }
  // Loop through course sections
  for (const sectionDirName of fs.readdirSync(contentDirPath)) {
    let section = processSection(sectionDirName, contentDirPath, course)
    if (section) course.sections.push(section)
  }

  return course
  // const { sections, toc } = await processCourse(courseDirName)
  // const { copy, frontmatter } = await processLanding(courseDirPath)
  // const firstChapterUrl = `/course/${courseDirName}/${toc[0].slug}/${toc[0].chapters[0].slug}`
}

function processSection(sectionDirName, contentDirPath, course) {
  const sectionDirPath = `${contentDirPath}/${sectionDirName}`
  if (!fs.lstatSync(sectionDirPath).isDirectory()) return // ignore files
  console.log('Processing section:', sectionDirName)
  // Get section metadata from _index.md file inside its folder
  const sectionIndexText = readText(`${sectionDirPath}/_index.md`)
  const { data: sectionFrontmatter } = matter(sectionIndexText)
  let section = {
    title: sectionFrontmatter.title,
    slug: sectionFrontmatter.slug,
    draft: sectionFrontmatter.draft,
    lessons: [],
  }
  for (const lessonFilename of fs.readdirSync(sectionDirPath)) {
    let lesson = processLesson(lessonFilename, sectionDirPath, course, section)
    if (lesson) section.lessons.push(lesson)
  }
  // Don't add section to the course if there are no lessons in it (like if all of them are drafts)
  if (!section.lessons.length) return
  return section
}

function processLesson(lessonFilename, sectionDirPath, course, section) {
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
    slug: lessonFrontmatter.slug,
    free: lessonFrontmatter.free,
    draft: lessonFrontmatter.draft,
    url: `/course/${course.slug}/${section.slug}/${lessonFrontmatter.slug}`, // used in prev-next and TOC
    body: '', // renderMDX
  }
  return lesson
}
