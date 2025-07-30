import { MessageChat } from '../../models/mysql/auth-user.model.js'

export const onBatchMessages = async (socket) => {
  if (socket.recovered) return

  const serverOffset = socket.handshake.auth.serverOffset ?? 0
  try {
    const results = await MessageChat.getId({ serverOffset })

    const mensajes = results.map(row => ({
      msg: row.content,
      serverOffset: row.id.toString(),
      username: row.user,
      date: new Date(row.created_at).toLocaleTimeString(),
      url: row.profile_image
    }))

    socket.emit('batch messages', mensajes)
  } catch (e) {
    console.log(e)
  }
}
