// Test de evento onDisconnect(): valida la lógica que ocurre cuando un cliente se desconecta del servidor.
// Se simula un socket y el objeto io de Socket.IO, y se usan mocks de funciones de usuario (removeUser, getUsersArray).


import { onDisconnect } from '../../../socket/events/onDisconnect.js'
import { removeUser, getUsersArray } from '../../../socket/users.js'

jest.mock('../../../socket/users.js', () => ({
  removeUser: jest.fn(),
  getUsersArray: jest.fn().mockReturnValue([{ username: 'testUser', url: 'profile-default.png' }])
}))

describe('onDisconnect', () => {
  let socket, io

  beforeEach(() => {
    socket = { id: '123' }
    io = { emit: jest.fn() }
  })

  test('debe eliminar usuario y emitir users-online', () => {
    onDisconnect(socket, io)

    expect(removeUser).toHaveBeenCalledWith('123')
    expect(io.emit).toHaveBeenCalledWith('users-online', [{ username: 'testUser', url: 'profile-default.png' }])
  })
})
