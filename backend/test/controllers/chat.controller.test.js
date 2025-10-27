// Test unitario de ChatController(): verifica la carga de páginas según tokens JWT y la subida de imágenes de perfil.
// Usa mocks de AuthUserModel y jsonwebtoken para simular validación de tokens, refresco de sesión y carga de avatar.
// Se validan respuestas HTTP, generación de nuevos tokens y manejo de errores de base de datos.


import { ChatController } from '../../controller/chat.controller.js'
import { AuthUserModel } from '../../models/mysql/auth-user.model.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, REFRESH_TOKEN_KEY } from '../../config.js'

// Mockeos
jest.mock('../../models/mysql/auth-user.model.js')
jest.mock('jsonwebtoken')

describe('ChatController', () => {
  let controller
  let req
  let res

  beforeEach(() => {
    controller = new ChatController()

    req = {
      cookies: {},
      file: { filename: 'avatar.png' },
      session: { user: { username: 'pepe' } }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      render: jest.fn(),
      send: jest.fn()
    }

    jest.clearAllMocks()
  })

  // -------- loadPages --------
  test('loadPages - access token válido', async () => {
    req.cookies.access_token = 'tokenValido'
    const mockUser = { id: 1, username: 'pepe' }
    jwt.verify.mockReturnValue(mockUser)

    await controller.loadPages(req, res)

    expect(jwt.verify).toHaveBeenCalledWith('tokenValido', SECRET_JWT_KEY)
    expect(res.render).toHaveBeenCalledWith('chat', mockUser)
  })

  test('loadPages - access token inválido, refresh token válido', async () => {
    req.cookies.access_token = 'tokenInvalido'
    req.cookies.refresh_token = 'refreshValido'
    const mockUser = { id: 1, username: 'pepe' }

    jwt.verify
      .mockImplementationOnce(() => { throw new Error('Token inválido') }) // access token falla
      .mockReturnValueOnce(mockUser) // refresh token pasa

    jwt.sign.mockReturnValue('nuevoAccessToken')

    await controller.loadPages(req, res)

    expect(jwt.verify).toHaveBeenCalledWith('tokenInvalido', SECRET_JWT_KEY)
    expect(jwt.verify).toHaveBeenCalledWith('refreshValido', REFRESH_TOKEN_KEY)
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, username: mockUser.username },
      SECRET_JWT_KEY,
      { expiresIn: '30m' }
    )
    expect(res.cookie).toHaveBeenCalledWith('access_token', 'nuevoAccessToken', expect.any(Object))
    expect(res.render).toHaveBeenCalledWith('chat', mockUser)
  })

  test('loadPages - tokens inválidos, devuelve 403', async () => {
    req.cookies.access_token = 'tokenInvalido'
    req.cookies.refresh_token = 'refreshInvalido'

    jwt.verify
      .mockImplementation(() => { throw new Error('Token inválido') }) // access token falla
      .mockImplementationOnce(() => { throw new Error('Refresh inválido') }) // refresh falla

    await controller.loadPages(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith('<p>Token expirado o inválido</p><a href="/auth">Volver</a>')
  })

  test('loadPages - sin refresh token, devuelve 403', async () => {
    req.cookies.access_token = 'tokenInvalido'

    jwt.verify.mockImplementation(() => { throw new Error('Token inválido') })

    await controller.loadPages(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith('<p>Sesión no válida. Logueate otra vez.</p><a href="/auth">Volver</a>')
  })

  // -------- uploadImages --------
  test('uploadImages - éxito', async () => {
    AuthUserModel.uploadProfileImage.mockResolvedValue(true)

    await controller.uploadImages(req, res)

    expect(AuthUserModel.uploadProfileImage).toHaveBeenCalledWith({
      url: 'avatar.png',
      username: 'pepe'
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Imagen subida correctamente',
      imageUrl: 'avatar.png'
    })
  })

  test('uploadImages - falla', async () => {
    AuthUserModel.uploadProfileImage.mockRejectedValue(new Error('DB error'))

    await controller.uploadImages(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No se subió ningún archivo'
    })
  })
})
