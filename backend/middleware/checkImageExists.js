import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsPath = path.join(__dirname, '../uploads')

export const checkImageExists = (req, res, next) => {
  const requestedPath = path.join(uploadsPath, req.path)

  fs.access(requestedPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si no existe el archivo, devolvemos la imagen por defecto
      const fallbackPath = path.join(uploadsPath, 'profile-default.jpg')
      return res.sendFile(fallbackPath)
    }
    // Si existe, seguimos al siguiente middleware (el express.static)
    next()
  })
}
