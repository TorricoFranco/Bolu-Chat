import { VEXOR_PUBLISHABLEKEY, VEXOR_PROJECTID, VEXOR_SECRETKEY } from '../config.js'
import { Vexor } from 'vexor'
import dotenv from 'dotenv'

dotenv.config()


const vexorInstance = new Vexor({
  publishableKey: VEXOR_PUBLISHABLEKEY,
  projectId: VEXOR_PROJECTID,
  secretKey: VEXOR_SECRETKEY
})


export class DonationsController {

  create_payment = async (req, res) => {
    const { title, unit_price, quantity} = req.body || {}
    
    if ( !title || !unit_price || !quantity) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' })
    }

    try {
      const paymentResponse = await vexorInstance.pay.mercadopago({
        items: [
          {
            title: title,
            unit_price: unit_price,
            quantity: quantity,
          }
        ]
      })
    // console.log(items)
      res.status(200).json({ success: true, payment_url: paymentResponse.payment_url })
    } catch (err) {
      console.error('[Donations] Error creando pago', err?.message || err)
      return res.status(500).json({ success: false, message: 'Error creando pago' })
    }
  }

  // POST /api/donations/webhook
  webhook = async (req, res) => {
    console.log("webhook123")
  
  }

  success = async (req, res) => {
    console.log("success")

    return res.status(200).send('<h1>¡Gracias por tu donación! ✅</h1><a href="/chat">Volver al chat</a>')
  }

  pending = async (req, res) => {
    console.log("pending")
    return res.status(200).send('<h1>Tu donación está pendiente ⏳</h1><a href="/chat">Volver al chat</a>')
  }

  failure = async (req, res) => {
    console.log("failure")
    return res.status(200).send('<h1>El pago no se completó ❌</h1><a href="/chat">Volver al chat</a>')
  }

}   

