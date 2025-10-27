/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Endpoints relacionados con el chat y carga de imágenes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadImageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Imagen subida correctamente"
 *         imageUrl:
 *           type: string
 *           example: "uploads/profile_12345.png"
 *
 *     ChatErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "No se subió ningún archivo"
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 */

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Cargar la página del chat
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Página de chat cargada correctamente (HTML)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body>Chat page</body></html>"
 *       403:
 *         description: Token inválido o expirado, requiere login nuevamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<p>Sesión no válida. Logueate otra vez.</p><a href='/auth'>Volver</a>"
 *
 * /chat/images:
 *   post:
 *     summary: Subir imagen al chat (perfil o mensaje)
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen a subir
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadImageResponse'
 *       400:
 *         description: No se subió ningún archivo o hubo error al guardar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *       403:
 *         description: No autorizado, token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 */
