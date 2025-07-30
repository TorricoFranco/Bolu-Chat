const connectedUsers = new Map()

export const addUser = (socketId, { username, url }) => {
  connectedUsers.set(socketId, { username, url })
}

export const removeUser = (socketId) => {
  connectedUsers.delete(socketId)
}

export const getUsersArray = () => {
  return Array.from(connectedUsers.values())
}
