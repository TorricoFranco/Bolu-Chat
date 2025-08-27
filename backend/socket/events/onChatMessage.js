import { MessageChat, AuthUserModel } from '../../models/mysql/auth-user.model.js'
import { filterWords } from '../../utils/filterWords.js'

export const onChatMessage = (socket, io, countMessages) => {
  socket.on('chat message', async (msg) => {
    const MAX_LENGTH = 25
    const wordsFilters = filterWords(msg)
    const username = socket.handshake.auth.username ?? 'Anonymous'

    if (wordsFilters.length > MAX_LENGTH) {
      return socket.emit('errorMessage', `El mensaje es demasiado largo. Máximo ${MAX_LENGTH} caracteres.`)
    }

    try {
      const result = await MessageChat.create({ msg: wordsFilters, username })
      const lastRowId = await MessageChat.lastInsertRowId()
      const URLProfile = await AuthUserModel.recoverImageProfile({ username })
      const formattedTime = new Date(result.created_at)

      await MessageChat.uploadCountMessages({ username })

      io.emit('chat message', {
        msg: wordsFilters,
        serverOffset: lastRowId.toString(),
        username,
        date: formattedTime,
        url: URLProfile,
        countMessages
      })
    } catch (e) {
      console.log(e)
    }
  })
}
