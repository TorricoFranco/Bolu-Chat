// socket/index.js
import { Server } from 'socket.io'
import { handleSocketConnection } from './handleSocketConnection.js'
import { createServer } from 'node:http'

export const configureSocket = (app) => {
  const server = createServer(app)
  const io = new Server(server, {
    connectionStateRecovery: {}
  })

  io.on('connection', (socket) => {
    try {
      handleSocketConnection(socket, io)
    } catch (err) {
      console.error('❌ Error en handleSocketConnection:', err)
    }
  })
  return server
}
