// import multer from 'multer'
// import sharp from 'sharp'
// import path from 'path'

// // Multer guarda en memoria
// const upload = multer({ storage: multer.memoryStorage() })

// // se sube y optimiza la imagen
// export const uploadImageMiddleware = async (req, res, next) => {
//   upload.single('userProfile')(req, res, async function (err) {
//     if (err) return res.status(500).send('Error al subir la imagen')
//     if (!req.file) return res.status(400).send('No se subió ninguna imagen')

//     try {
//       const ext = 'jpeg'
//       const filename = `${Date.now()}.${ext}`
//       const outputPath = path.join('uploads', filename)

//       // Optimizar con Sharp
//       await sharp(req.file.buffer)
//         .resize(300, 300)
//         .jpeg({ quality: 80 })
//         .toFile(outputPath)

//       // Guardar el nombre del archivo optimizado para usarlo en el controlador
//       req.file.filename = filename

//       next()
//     } catch (e) {
//       console.error(e)
//       res.status(500).send('Error al procesar la imagen')
//     }
//   })
// }


import multer from 'multer'
import sharp from 'sharp'
import path from 'path'

// Multer guarda en memoria
const upload = multer({ storage: multer.memoryStorage() })

// Función pura para procesar la imagen
export const processImage = async (fileBuffer) => {
  const ext = 'jpeg'
  const filename = `${Date.now()}.${ext}`
  const outputPath = path.join('uploads', filename)

  await sharp(fileBuffer)
    .resize(300, 300)
    .jpeg({ quality: 80 })
    .toFile(outputPath)

  return filename
}

// Middleware
export const uploadImageMiddleware = (req, res, next) => {
  upload.single('userProfile')(req, res, async function (err) {
    if (err) return res.status(500).send('Error al subir la imagen')
    if (!req.file) return res.status(400).send('No se subió ninguna imagen')

    try {
      req.file.filename = await processImage(req.file.buffer)
      next()
    } catch (e) {
      console.error(e)
      res.status(500).send('Error al procesar la imagen')
    }
  })
}
