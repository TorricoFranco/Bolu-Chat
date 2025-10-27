// Test de evento onChatMessage(): verifica el flujo completo de envío de mensajes en tiempo real.
// Se simula un socket y un servidor (io) de Socket.IO, usando mocks de MessageChat y AuthUserModel
// para aislar la lógica de base de datos, y un mock de filterWords para no filtrar el mensaje.



import { onChatMessage } from '../../../socket/events/onChatMessage.js'
import { MessageChat, AuthUserModel } from '../../../models/mysql/auth-user.model.js'
import { filterWords } from '../../../utils/filterWords.js'

jest.mock('../../../models/mysql/auth-user.model.js', () => ({
  MessageChat: {
    create: jest.fn(),
    lastInsertRowId: jest.fn(),
    uploadCountMessages: jest.fn()
  },
  AuthUserModel: { recoverImageProfile: jest.fn() }
}))

jest.mock('../../../utils/filterWords.js', () => ({ filterWords: jest.fn(msg => msg) }))

describe('onChatMessage', () => {
  let socket, io

  beforeEach(() => {
    socket = { on: jest.fn((event, cb) => { socket._cb = cb }), handshake: { auth: { username: 'testUser' } } }
    io = { emit: jest.fn() }

    MessageChat.create.mockResolvedValue({ created_at: new Date() })
    MessageChat.lastInsertRowId.mockResolvedValue(1)
    AuthUserModel.recoverImageProfile.mockResolvedValue('img.png')
    MessageChat.uploadCountMessages.mockResolvedValue()
  })

  test('envia mensaje correctamente', async () => {
    onChatMessage(socket, io, 0)
    await socket._cb('Hola mundo')

    expect(MessageChat.create).toHaveBeenCalledWith({ msg: 'Hola mundo', username: 'testUser' })
    expect(io.emit).toHaveBeenCalledWith('chat message', expect.objectContaining({
      msg: 'Hola mundo',
      username: 'testUser',
      url: 'img.png'
    }))
  })
})
