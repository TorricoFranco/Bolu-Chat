// WebHook no implementado todavía

/**
 * @swagger
 * tags:
 *   - name: Donations
 *     description: Endpoints relacionados con donaciones y pagos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DonationRequest:
 *       type: object
 *       required:
 *         - title
 *         - unit_price
 *         - quantity
 *       properties:
 *         title:
 *           type: string
 *           example: "Donación para BoluChat"
 *         unit_price:
 *           type: number
 *           example: 500
 *           description: Precio unitario en la moneda configurada en Vexor
 *         quantity:
 *           type: integer
 *           example: 1
 *
 *     DonationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         payment_url:
 *           type: string
 *           example: "https://www.mercadopago.com.ar/checkout/v1/payment/XYZ123"
 *
 *     DonationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Datos inválidos"
 */

/**
 * @swagger
 * /donations/create_payment:
 *   post:
 *     summary: Crear preferencia de pago para donación
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationRequest'
 *     responses:
 *       200:
 *         description: Pago creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DonationResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DonationErrorResponse'
 *       500:
 *         description: Error al crear pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DonationErrorResponse'
 *
 * /donations/webhook:
 *   post:
 *     summary: Webhook de notificaciones de pago (pendiente)
 *     tags: [Donations]
 *     requestBody:
 *       description: Datos enviados por Vexor/MercadoPago
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               id: "12345"
 *               status: "approved"
 *     responses:
 *       200:
 *         description: Webhook recibido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: true
 *       400:
 *         description: Webhook inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: false
 *                 message: "Webhook inválido"
 */
