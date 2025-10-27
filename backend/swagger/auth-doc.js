/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints relacionados con autenticación de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: "martillito"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 32
 *           example: "Passw0rd!"
 *           description: Debe incluir mayúsculas, minúsculas, número y carácter especial.
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "martillito"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "El username debe tener al menos 3 caracteres"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */



/**
 * @swagger
 * /auth:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Cargar la página principal de sesión
 *     description: Retorna la página con los datos del usuario si existe sesión activa.
 *     responses:
 *       200:
 *         description: Página cargada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Error al cargar la página
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Cerrar sesión del usuario
 *     description: Limpia las cookies de acceso y refresh token.
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       500:
 *         description: Error al cerrar sesión
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
