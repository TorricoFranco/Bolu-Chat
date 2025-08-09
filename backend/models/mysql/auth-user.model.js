import pool from './bd.js'
import bcrypt from 'bcrypt'

export class AuthUserModel {
  static async create ({ username, password }) {
    try {
      const [existingUser] = await pool.query(
        'SELECT * FROM authUser WHERE username = ?;',
        [username]
      )
      if (existingUser.length > 0) {
        throw new Error('El usuario ya existe')
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await pool.query(
        'INSERT INTO authUser (username, password) VALUES (?, ?);',
        [username, hashedPassword]
      )

      const [publicUser] = await pool.query(
        'SELECT BIN_TO_UUID(id) AS id, username FROM authUser WHERE username = ?;',
        [username]
      )
      return publicUser[0]
    } catch (err) {
      console.error('Error', err.message)
      throw new Error('Error al crear usuario.')
    }
  }

  static async login ({ username, password }) {
    try {
      const [user] = await pool.query(
        'SELECT BIN_TO_UUID(id) AS id, username, password FROM authUser WHERE username = ?;',
        [username]
      )
      if (user.length === 0) {
        throw new Error('Usuario no encontrado')
      }

      const isValid = await bcrypt.compare(password, user[0].password)
      if (!isValid) throw new Error('Password is invalid')

      const { id } = user[0]
      return { id, username }
    } catch (err) {
      console.error('Error', err.message)
      throw new Error('Error al logear el usuario.')
    }
  }

  static async uploadProfileImage ({ url, username }) {
    await pool.query(
      'UPDATE authUser SET profile_image = ? WHERE username = ?;',
      [url, username]
    )
  }

  static async recoverImageProfile ({ username }) {
    const [result] = await pool.query(
      'SELECT profile_image FROM authUser WHERE username = ?;',
      [username]
    )
    return result[0]?.profile_image
  }
}

export class MessageChat {
  static async create ({ msg, username }) {
    await pool.query(
      'INSERT INTO messages (content, user) VALUES (?, ?);',
      [msg, username]
    )
    const [user] = await pool.query(
      'SELECT * FROM messages WHERE user = ? ORDER BY id DESC LIMIT 1;',
      [username]
    )
    return user[0]
  }

  static async lastInsertRowId () {
    const [rows] = await pool.query(
      'SELECT id FROM messages ORDER BY id DESC LIMIT 1;'
    )
    return rows[0]
  }

  static async getId ({ serverOffset }) {
    const [id] = await pool.query(
      `SELECT messages.id, messages.created_at, messages.content, messages.user,
      authUser.profile_image 
      FROM messages
      JOIN authUser ON messages.user = authUser.username
      WHERE messages.id > ?`,
      [serverOffset]
    )
    return id
  }

  static async uploadCountMessages ({ username }) {
    await pool.query(
      `INSERT INTO countMessages (user, count)
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE count = count + 1;`,
      [username]
    )
  }

  static async getCountMessages () {
    const [result] = await pool.query(
      `SELECT c.user, c.count, a.profile_image
      FROM countMessages c
      JOIN authUser a ON a.username = c.user;`
    )
    return result
  }

  static async clearChat () {
    await pool.query('TRUNCATE TABLE messages;')
  }
}
