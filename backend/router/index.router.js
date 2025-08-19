import { Router } from 'express'
import { authUserRouter } from './auth-user.router.js'
import { chatRouter } from './chat.router.js'
import { donationsRouter } from './donations.router.js'

export const routerIndex = (app) => {
  const router = Router()

  app.use('/', router)
  router.get('/', (req, res) => {
    res.status(200).redirect('/auth')
  })

  router.use('/auth', authUserRouter())
  router.use('/chat', chatRouter())
  router.use('/donations', donationsRouter())
  
  return router
}
