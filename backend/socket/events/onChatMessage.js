import { MessageChat, AuthUserModel } from '../../models/mysql/auth-user.model.js'
import { filterWords } from '../../utils/filterWords.js'

export const onChatMessage = (socket, io, countMessages) => {
  const MAX_LENGTH = 40
  // Rate limiting
  const MAX_MESSAGES = 5
  const WINDOW_MS = 2000 
  const MAX_VIOLATIONS = 3   
  const VIOLATION_RESET_MS = 60000

  let messageCount = 0 
  let countDisconnectSocket = 0

  let lastReset = Date.now()
  
  socket.on('chat message', async (msg) => {
    
    const now = Date.now()

    // Reiniciar contador si pasó la ventana
    if (now - lastReset > WINDOW_MS) {
      messageCount = 0
      lastReset = now
    }

    messageCount++

    // Si supera el límite, desconectar o ignorar
    if (messageCount > MAX_MESSAGES) {
      countDisconnectSocket++
      socket.emit('errorMessage', 'Demasiados mensajes enviados. Espera un momento.')
      messageCount = 0
  
      if(countDisconnectSocket > MAX_VIOLATIONS) {
        console.log(`[DISCONNECT] Usuario ${socket.handshake.auth.username ?? 'Anonymous'} desconectado por spam`)
        return socket.disconnect()
      }

      return
    }
    
    const wordsFilters = filterWords(msg)
    const username = socket.handshake.auth.username ?? 'Anonymous'

    if (wordsFilters.length > MAX_LENGTH) {
      console.log(`[WARN] Usuario ${username} intentó enviar mensaje demasiado largo: ${wordsFilters.length} caracteres`)
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

    setTimeout(() => {
      countDisconnectSocket = Math.max(countDisconnectSocket - 1, 0)
    }, VIOLATION_RESET_MS)
  })
}
