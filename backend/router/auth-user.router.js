import { Router } from 'express'
import { AuthUserController } from '../controller/auth-user.controller.js'

export const authUserRouter = () => {
  const authUserRouter = Router()
  const authUserController = new AuthUserController()


  authUserRouter.get('/', authUserController.loadPage)


  authUserRouter.post('/register', authUserController.register)
  authUserRouter.post('/login', authUserController.login)
  authUserRouter.post('/logout', authUserController.logout)
  return authUserRouter
}
