import fs from 'fs'
import path from 'path'

function ensureDirectoryExistence(filePath) {
  var currentDirName = path.dirname(filePath)
  if (fs.existsSync(currentDirName)) return true
  ensureDirectoryExistence(currentDirName) // check nested dir
  fs.mkdirSync(currentDirName) // create folder for this one
}

export function saveJson(path, object) {
  ensureDirectoryExistence(path)
  fs.writeFileSync(path, JSON.stringify(object))
}

export function readText(path) {
  return fs.readFileSync(path, 'utf8')
}
