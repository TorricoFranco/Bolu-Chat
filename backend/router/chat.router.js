import { Router } from 'express'
import { ChatController } from '../controller/chat.controller.js'
import { uploadImageMiddleware } from '../middleware/uploadImageMiddleware.js'
import { deletePreviousFileMiddleware } from '../middleware/deletePreviousFileMiddleware.js'

export const chatRouter = () => {
  const chatRouter = Router()
  const chatController = new ChatController()

  chatRouter.get('/', chatController.loadPages)
  chatRouter.post('/images',
    uploadImageMiddleware,
    deletePreviousFileMiddleware,
    chatController.uploadImages)

  return chatRouter
}
