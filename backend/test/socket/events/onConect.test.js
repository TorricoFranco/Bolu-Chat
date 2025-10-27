// Test de evento onConnect(): valida la lógica que ocurre cuando un cliente se conecta al servidor
// Se simula un socket y el objeto io de Socket.IO, y se usan mocks de AuthUserModel y funciones de usuario (addUser, getUsersArray)

import { onConnect } from '../../../socket/events/onConnect.js'
import { addUser, getUsersArray } from '../../../socket/users.js'
import { AuthUserModel } from '../../../models/mysql/auth-user.model.js'

jest.mock('../../../models/mysql/auth-user.model.js', () => ({
  AuthUserModel: { recoverImageProfile: jest.fn() }
}))
jest.mock('../../../socket/users.js', () => ({
  addUser: jest.fn(),
  getUsersArray: jest.fn().mockReturnValue([{ username: 'testUser', url: 'profile-default.png' }])
}))

describe('onConnect', () => {
  let socket, io

  beforeEach(() => {
    socket = { handshake: { auth: { username: 'testUser' } }, broadcast: { emit: jest.fn() } }
    io = { emit: jest.fn() }
    AuthUserModel.recoverImageProfile.mockResolvedValue('profile-default.png')
  })

  test('debe agregar usuario y emitir eventos', async () => {
    await onConnect(socket, io)

    expect(addUser).toHaveBeenCalledWith(socket.id, { username: 'testUser', url: 'profile-default.png' })
    expect(io.emit).toHaveBeenCalledWith('users-online', [{ username: 'testUser', url: 'profile-default.png' }])
    expect(socket.broadcast.emit).toHaveBeenCalledWith('user-connected', 'testUser', expect.any(Object))
  })
})
