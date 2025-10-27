// Test unitario de authMiddleware(): valida el comportamiento del middleware de autenticación
// con diferentes escenarios de token JWT (válido, inválido o ausente), usando mocks de jsonwebtoken.

import { authMiddleware } from '../../middleware/authMiddleware'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken') // Mock de jwt

describe('authMiddleware', () => {
  let req, res, next

  beforeEach(() => {
    req = { cookies: {} }
    res = {}
    next = jest.fn()
    jest.clearAllMocks()
  })

  test('Token válido asigna req.session.user', () => {
    const fakeUser = { id: 1, username: 'pepe' }
    req.cookies.access_token = 'valid_token'
    jwt.verify.mockReturnValue(fakeUser)

    authMiddleware(req, res, next)

    expect(req.session.user).toEqual(fakeUser)
    expect(next).toHaveBeenCalled()
  })

  test('Token inválido deja req.session.user null', () => {
    req.cookies.access_token = 'bad_token'
    jwt.verify.mockImplementation(() => { throw new Error('invalid') })

    authMiddleware(req, res, next)

    expect(req.session.user).toBeNull()
    expect(next).toHaveBeenCalled()
  })

  test('Sin token deja req.session.user null', () => {
    authMiddleware(req, res, next)

    expect(req.session.user).toBeNull()
    expect(next).toHaveBeenCalled()
  })
})
