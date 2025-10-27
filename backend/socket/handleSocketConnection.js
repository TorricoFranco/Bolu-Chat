import { onConnect } from './events/onConnect.js'
import { onDisconnect } from './events/onDisconnect.js'
import { onChatMessage } from './events/onChatMessage.js'
import { onBatchMessages } from './events/onBatchMessages.js'
import { MessageChat } from '../models/mysql/auth-user.model.js'

export const handleSocketConnection = async (socket, io) => {
  const username = socket.handshake.auth?.username 
  console.log('User connected:', username)

  await onConnect(socket, io)

  socket.on('disconnect', () => {
    onDisconnect(socket, io)
  })

  const countMessages = await MessageChat.getCountMessages()
  socket.emit('count-message', { countMessages })

  onChatMessage(socket, io, countMessages)
  onBatchMessages(socket)
}
