import { AuthUserModel } from '../models/mysql/auth-user.model.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, REFRESH_TOKEN_KEY } from '../config.js'
import { validateUser } from '../schema/user-validation.js'

export class AuthUserController {
  loadPage = async (req, res) => {
    const { user } = req.session
    res.status(200).render('index', user)
  }

  register = async (req, res) => {
    const { username, password } = req.body
    // VALIDACIONES
    const userData = {
      username: username.toString(),
      password: password.toString()
    }
    const result = validateUser(userData)

    if (!result.success) {
      const errors = JSON.parse(result.error.message).map((err) => err.message)
      return res.status(400).json({ success: false, errors })
    }
    try {
      const user = await AuthUserModel.create({ username, password })
      const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY,
        {
          expiresIn: '1h'
        })

      const refreshToken = jwt.sign({ id: user._id, username: user.username }, REFRESH_TOKEN_KEY,
        {
          expiresIn: '7d'
        }
      )
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
        })
        .status(200)
        .send({ user, token })
    } catch (err) {
      console.log('error register')
      res.status(401).send(err.message)
    }
  }

  login = async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await AuthUserModel.login({ username, password })
      const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY,
        {
          expiresIn: '1h'
        })

      const refreshToken = jwt.sign({ id: user._id, username: user.username }, REFRESH_TOKEN_KEY,
        {
          expiresIn: '7d'
        })
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
        })
        .send({ user, token })
    } catch (err) {
      res.status(401).send(err.message)
    }
  }

  logout = async (req, res) => {
  // limpiar cookie
    res
      .clearCookie('refresh_token')
      .clearCookie('access_token')
      .json({ message: 'Logout successful' })
  }

  // protected = async (req, res) => {
  //   const { user } = req.session
  //   if (!user) return res.status(403).send('Access not authorized')
  //   res.render('protected', user)
  // }
}
