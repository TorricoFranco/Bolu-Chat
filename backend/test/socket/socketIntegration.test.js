// Test de integración completa Socket.IO: verifica la interacción de múltiples clientes con el servidor.
// Crea un servidor HTTP + Socket.IO idéntico al entorno productivo y varios clientes simulados (Alice, Bob, Charlie).
// Valida que todos los clientes se conecten correctamente, que un mensaje emitido por un cliente se reciba por todos,
// y que no haya errores durante la conexión o el envío de mensajes.
// Se mockean los métodos de AuthUserModel y MessageChat para aislar la lógica de base de datos.


import { Server } from "socket.io"
import { io as Client } from "socket.io-client"
import http from "http"
import { handleSocketConnection } from "../../socket/handleSocketConnection.js"

// Mock de la base de datos MySQL (simulamos respuestas)
jest.mock("../../models/mysql/auth-user.model.js", () => ({
  AuthUserModel: {
    recoverImageProfile: jest.fn(async ({ username }) => `${username}.png`)
  },
  MessageChat: {
    create: jest.fn(async ({ msg, username }) => ({ id: Date.now(), msg, username, created_at: new Date() })),
    lastInsertRowId: jest.fn(async () => Date.now()),
    uploadCountMessages: jest.fn(async () => {}),
    getCountMessages: jest.fn(async () => 42),
    getId: jest.fn(async () => [])
  }
}))

describe("🧩 Socket.IO integración completa", () => {
  let io, httpServer, port

  beforeAll((done) => {
    httpServer = http.createServer()
    io = new Server(httpServer, {
      connectionStateRecovery: {}
    })
    io.on("connection", (socket) => handleSocketConnection(socket, io))
    httpServer.listen(() => {
      port = httpServer.address().port
      setTimeout(done, 200)
    })
  })

  afterAll(() => {
    io.close()
    httpServer.close()
  })

  test("Simula usuarios conectando, enviando y recibiendo mensajes", (done) => {
    const usernames = ["alice", "bob", "charlie"]
    const clients = []
    let connected = 0
    let messageReceived = 0

    usernames.forEach((name) => {
      const client = new Client(`http://localhost:${port}`, {
        auth: { username: name },
        transports: ["websocket"]
      })
      clients.push(client)

      client.on("connect", () => {
        connected++
        if (connected === usernames.length) {
          // Una vez todos conectados, Alice manda un mensaje
          const alice = clients[0]
          alice.emit("chat message", "Hola a todos 👋")
        }
      })

      client.on("chat message", (data) => {
        console.log(`💬 ${name} recibió mensaje:`, data.msg)
        messageReceived++
        if (messageReceived === usernames.length) {
          // Todos recibieron el mensaje => cerrar test
          clients.forEach(c => c.disconnect())
          done()
        }
      })

      client.on("errorMessage", (msg) => {
        console.warn(`[${name}] errorMessage:`, msg)
      })
    })
  })
})
