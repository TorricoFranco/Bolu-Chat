import { Router } from 'express'
import { DonationsController } from '../controller/donations.controller.js'

export const donationsRouter = () => {
  const donationsRouter = Router()
  const donationsController = new DonationsController()

  // Crear preferencia de donación
  donationsRouter.post('/create_payment', donationsController.create_payment)

  // Webhook de notificaciones (payment) // Notificación - todavia no implementado
  donationsRouter.post('/webhook', donationsController.webhook)

  // Páginas de retorno
  // Proximamente
  donationsRouter.get('/success', donationsController.success)
  donationsRouter.get('/pending', donationsController.pending)
  donationsRouter.get('/failure', donationsController.failure)

  return donationsRouter
}

