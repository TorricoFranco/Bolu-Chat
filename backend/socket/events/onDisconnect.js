import { removeUser, getUsersArray } from '../users.js'

export const onDisconnect = (socket, io) => {
  removeUser(socket.id)
  io.emit('users-online', getUsersArray())
}
