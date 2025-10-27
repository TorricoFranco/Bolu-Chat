// `onBatchMessages.test.js` – Test de evento de socket que simula la emisión de mensajes en **batch**
//   Valida que el evento `batch messages` se emita correctamente con datos mockeados de la base de datos (`MessageChat.getId`), transformando la información al formato esperado por los clientes.


import { onBatchMessages } from '../../../socket/events/onBatchMessages.js'
import { MessageChat } from '../../../models/mysql/auth-user.model.js'

jest.mock('../../../models/mysql/auth-user.model.js', () => ({
  MessageChat: { getId: jest.fn() }
}))

describe('onBatchMessages', () => {
  let socket

  beforeEach(() => {
    socket = { emit: jest.fn(), handshake: { auth: {} }, recovered: false }
  })

  test('emite batch messages con mensajes mockeados', async () => {
    const mockData = [{ id: 1, content: 'Hola', user: 'testUser', created_at: '2025-10-25', profile_image: 'img.png' }]
    MessageChat.getId.mockResolvedValue(mockData)

    await onBatchMessages(socket)

    expect(socket.emit).toHaveBeenCalledWith('batch messages', [{
      msg: 'Hola',
      serverOffset: '1',
      username: 'testUser',
      date: '2025-10-25',
      url: 'img.png'
    }])
  })
})
