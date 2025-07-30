import fs from 'fs'
import path from 'path'

export const deletePreviousFileMiddleware = (req, res, next) => {
  const previusFile = req.body.previusUserProfile

  if (!previusFile || previusFile === 'profile_default.jpg') return next() // No hay archivo anterior, seguir

  // Si vino como "/uploads/archivo.jpg", extraemos solo el nombre
  const fileName = path.basename(previusFile)

  const filePath = path.join('uploads', fileName)

  // Verificamos si existe y lo eliminamos
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al borrar el archivo anterior:', err)
        else console.log('Archivo anterior eliminado:', fileName)
      })
    }
    next() // Seguir con el siguiente middleware
  })
}
