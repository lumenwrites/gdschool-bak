import fs from 'fs'
import path from 'path'
import slugifyUrl from 'slugify'

export function ensureDirExists(filePath) {
  var currentDirName = path.dirname(filePath)
  if (fs.existsSync(currentDirName)) return true
  ensureDirExists(currentDirName) // check nested dir
  fs.mkdirSync(currentDirName) // create folder for this one
}

export function saveJson(path, object) {
  ensureDirExists(path)
  fs.writeFileSync(path, JSON.stringify(object))
}

export function readText(path) {
  return fs.readFileSync(path, 'utf8')
}

export function slugify(title) {
  return slugifyUrl(title, { lower: true, strict: true })
}
