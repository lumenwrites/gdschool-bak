import { join } from 'path'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { lstatSync, existsSync } from 'fs'

const coursesDir = './courses'
const jsonDir = join(process.cwd(), './backend/json/courses')

export async function processCourses() {
  console.log('[processCourses] Generating course json...')

  for (const courseDirName of readdirSync(coursesDir)) {
    const courseDirPath = join(coursesDir, courseDirName)
    if (!lstatSync(courseDirPath).isDirectory()) continue // ignore .DS_Store
    console.log('Processing course:', courseDirName)
    console.log('[processCourses] Success! Markdown courses converted to json.')
    let courses = {}
    courses[courseDirName]  = {
      folder: courseDirName
    }
    saveJson(`${jsonDir}/courses.json`, courses)
  }
}

function saveJson(path, object) {
  writeFileSync(path, JSON.stringify(object))
}
