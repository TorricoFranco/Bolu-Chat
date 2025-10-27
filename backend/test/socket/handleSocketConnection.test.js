// Test de integración de handleSocketConnection(): verifica el comportamiento del servidor Socket.IO
// al gestionar eventos de conexión, mensajes y desconexión entre cliente y servidor. 
// Usa un servidor HTTP temporal y un cliente de socket.io para simular la comunicación en tiempo real,
// validando que se emitan correctamente los eventos "count-message", "batch messages", "chat message" 
// y "users-online". Se mockean los métodos de AuthUserModel y MessageChat para aislar la lógica de base de datos.


import { createServer } from 'http'
import { Server } from 'socket.io'
import Client from 'socket.io-client'
import { handleSocketConnection } from '../../socket/handleSocketConnection'

// Mock DB y utils
jest.mock('../../models/mysql/auth-user.model.js', () => ({
  MessageChat: {
    getCountMessages: jest.fn().mockResolvedValue(0),
    getId: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ created_at: new Date() }),
    lastInsertRowId: jest.fn().mockResolvedValue(1),
    uploadCountMessages: jest.fn(),
  },
  AuthUserModel: {
    recoverImageProfile: jest.fn().mockResolvedValue('profile-default.png'),
  },
}))

describe('handleSocketConnection Integration', () => {
  let io, server, clientSocket
  let countMessageData = null
  let batchMessagesData = null

  beforeAll((done) => {
    const httpServer = createServer()
    io = new Server(httpServer)

    io.on('connection', (socket) => {
      socket.recovered = false
      handleSocketConnection(socket, io)
    })

    httpServer.listen(() => {
      const port = httpServer.address().port

      clientSocket = new Client(`http://localhost:${port}`, {
        auth: { username: 'testUser' },
        autoConnect: false,
      })

      // Listeners antes de conectar
      clientSocket.on('count-message', (data) => { countMessageData = data })
      clientSocket.on('batch messages', (data) => { batchMessagesData = data })

      clientSocket.connect()
      clientSocket.on('connect', () => done())
    })

    server = httpServer
  })

  afterAll(() => {
    io.close()
    clientSocket.close()
    server.close()
  })

  test('emite count-message al conectar', () => {
    expect(countMessageData).toEqual({ countMessages: 0 })
  })

  test('emite batch messages al conectar', () => {
    expect(batchMessagesData).toEqual([])
  })

  test('chat message funciona correctamente', async () => {
    const testMsg = 'Hola desde test'
    let chatMessageData = null

    clientSocket.on('chat message', (data) => { chatMessageData = data })

    // Emitimos el evento
    clientSocket.emit('chat message', testMsg)

    // Esperamos un tick para que el servidor procese
    await new Promise((r) => setTimeout(r, 50))

    expect(chatMessageData).toEqual(expect.objectContaining({
      msg: testMsg,
      username: 'testUser',
      url: 'profile-default.png',
    }))
  })

  test('disconnect llama onDisconnect', async () => {
    const emitSpy = jest.spyOn(io, 'emit')

    clientSocket.disconnect()

    await new Promise((r) => setTimeout(r, 50))

    expect(emitSpy).toHaveBeenCalledWith('users-online', expect.any(Array))

    emitSpy.mockRestore()
  })
})
