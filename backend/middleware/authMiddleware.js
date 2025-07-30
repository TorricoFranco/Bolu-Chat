import { SECRET_JWT_KEY } from '../config.js'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token
  // Esto es para que no rompa el servidor si no hay token
  // req.session es un objeto que se puede usar para almacenar datos de sesión
  req.session = { user: null }
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch {}
  next()
}
