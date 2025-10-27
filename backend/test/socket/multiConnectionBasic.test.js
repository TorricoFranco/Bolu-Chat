// Test de integración básica de múltiples clientes Socket.IO
// Crea un servidor HTTP + Socket.IO real y varios clientes simulados
// Verifica que todos los clientes se conecten correctamente y que no haya errores
// Finalmente desconecta todos los clientes y cierra el servidor limpiamente

// Se puede cambiar la cantidad de clientes usando la variable de entorno NUM_CLIENTS:
//   $env:NUM_CLIENTS=10; npm run test multiConnectionBasic.test.js

import { Server } from 'socket.io'
import { io as Client } from 'socket.io-client'
import http from 'http'

const NUM_CLIENTS = parseInt(process.env.NUM_CLIENTS || "5", 10)

jest.setTimeout(20000)

describe('Conexión múltiple básica', () => {
  let io, httpServer, port

  beforeAll((done) => {
    httpServer = http.createServer()
    io = new Server(httpServer)
    io.on('connection', (socket) => {
      console.log("✅ Servidor: nuevo cliente", socket.id)
    })
    httpServer.listen(() => {
      port = httpServer.address().port
      setTimeout(done, 200) // pequeño delay
    })
  })

  afterAll(() => {
    io.close()
    httpServer.close()
  })

  test('5 clientes conectan correctamente', (done) => {
    let connected = 0
    const clients = []

    for (let i = 0; i < NUM_CLIENTS; i++) {
      const client = new Client(`http://localhost:${port}`, {
        transports: ['websocket', 'polling']
      })
      clients.push(client)
      client.on('connect', () => {
        connected++
        if (connected === NUM_CLIENTS) {
          clients.forEach(c => c.disconnect())
          done()
        }
      })
      client.on('connect_error', (err) => {
        console.error(`❌ Error conectando cliente ${i + 1}:`, err.message)
      })
    }
  })
})

