import fs from 'node:fs'

export function saveImage (file) {
  const newPath = `./uploads/${file.originalname}`
  fs.renameSync(file.path, newPath)
  return newPath
}
