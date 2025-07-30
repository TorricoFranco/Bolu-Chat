import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, REFRESH_TOKEN_KEY } from '../config.js'
import { AuthUserModel } from '../models/mysql/auth-user.model.js'
// import { saveImage } from '../utils/saveImage.js'

export class ChatController {
  loadPages = async (req, res) => {
    const accessToken = req.cookies.access_token
    const refreshToken = req.cookies.refresh_token

    try {
      const user = jwt.verify(accessToken, SECRET_JWT_KEY)
      return res.render('chat', user)
    } catch (err) {
      console.log('Access token inválido o expirado:', err.message)

      // Si hay refresh token, probamos usarlo
      if (refreshToken) {
        try {
          const user = jwt.verify(refreshToken, REFRESH_TOKEN_KEY)

          // Generar nuevo access_token
          const newAccessToken = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_JWT_KEY,
            { expiresIn: '30m' }
          )

          // Lo reenviamos como cookie
          res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 30
          })

          // Renderizamos igual
          return res.render('chat', user)
        } catch (err2) {
          console.log('Refresh token inválido también:', err2.message)
          return res.status(403).send('<p>Token expirado o inválido</p><a href="/auth">Volver</a>')
        }
      } else {
        return res.status(403).send('<p>Sesión no válida. Logueate otra vez.</p><a href="/auth">Volver</a>')
      }
    }
  }

  uploadImages = async (req, res) => {
    try {
      // Guardr URL de la imagen en la base de datos

      await AuthUserModel.uploadProfileImage({ url: req.file.filename, username: req.session.user.username })

      res.status(200).json({
        success: true,
        message: 'Imagen subida correctamente',
        imageUrl: req.file.filename
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo' })
    }
  }
}
