// Test unitario de AuthUserController(): verifica el flujo completo de registro, login y logout.
// Usa mocks de AuthUserModel, jsonwebtoken y validateUser para simular la capa de datos y validación.
// Se validan respuestas HTTP, manejo de errores y generación de tokens JWT.

import { AuthUserController } from '../../controller/auth-user.controller.js'
import { AuthUserModel } from '../../models/mysql/auth-user.model.js'
import jwt from 'jsonwebtoken'
import { validateUser } from '../../schema/user-validation.js'

jest.mock('../../models/mysql/auth-user.model.js')
jest.mock('jsonwebtoken')
jest.mock('../../schema/user-validation.js')

describe('AuthUserController', () => {
  let controller
  let req
  let res

  beforeEach(() => {
    controller = new AuthUserController()

    req = {
      body: {},
      session: {}
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    }

    jest.clearAllMocks()
  })

  // -------- REGISTER TESTS --------
  test('register devuelve 400 si la validación falla', async () => {
    req.body = { username: 'a', password: 'b' }
    validateUser.mockReturnValue({ success: false, error: { message: JSON.stringify([{ message: 'Invalid data' }]) } })

    await controller.register(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ success: false, errors: ['Invalid data'] })
  })

  test('register devuelve 200 si el registro es exitoso', async () => {
    req.body = { username: 'pepe', password: '1234' }
    validateUser.mockReturnValue({ success: true })
    AuthUserModel.create.mockResolvedValue({ _id: 1, username: 'pepe' })
    jwt.sign.mockReturnValue('fakeToken')

    await controller.register(req, res)

    expect(res.cookie).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ user: { _id: 1, username: 'pepe' }, token: 'fakeToken' }))
  })

  // -------- LOGIN TESTS --------
  test('login devuelve 401 si el login falla', async () => {
    req.body = { username: 'pepe', password: 'wrong' }
    AuthUserModel.login.mockRejectedValue(new Error('Invalid credentials'))

    await controller.login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Invalid credentials')
  })

  test('login devuelve 200 si el login es correcto', async () => {
    req.body = { username: 'pepe', password: '1234' }
    AuthUserModel.login.mockResolvedValue({ _id: 1, username: 'pepe' })
    jwt.sign.mockReturnValue('fakeToken')

    await controller.login(req, res)

    expect(res.cookie).toHaveBeenCalledTimes(2)
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ token: 'fakeToken' }))
  })

  // -------- LOGOUT TESTS --------
  test('logout limpia cookies y devuelve 200', async () => {
    await controller.logout(req, res)

    expect(res.clearCookie).toHaveBeenCalledWith('refresh_token')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' })
  })
})
