import { addUser, getUsersArray } from '../users.js'
import { AuthUserModel } from '../../models/mysql/auth-user.model.js'

export const onConnect = async (socket, io) => {
  const username = socket.handshake.auth.username
  const URLProfile = await AuthUserModel.recoverImageProfile({ username })

  socket.handshake.auth.urlProfile = URLProfile ?? 'profile-default.png'

  addUser(socket.id, { username, url: URLProfile })
  io.emit('users-online', getUsersArray())

  socket.broadcast.emit('user-connected', username, {
    [username]: [URLProfile, new Date()]
  })
}
