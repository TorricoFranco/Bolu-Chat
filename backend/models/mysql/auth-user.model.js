import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

const connection = await mysql.createConnection(config)

export class AuthUserModel {
  static async create ({ username, password }) {
    try {
      // Verificar si el usuario ya existe
      const [existingUser] = await connection.query(
        'SELECT * FROM authUser WHERE username = ?;',
        [username]
      )
      if (existingUser.length > 0) {
        throw new Error('El usuario ya existe')
      }

      // Crear Usuario
      const hashedPassword = await bcrypt.hash(password, 10)
      await connection.query(
        'INSERT INTO authUser (username, password) VALUES (?, ?);',
        [username, hashedPassword]
      )

      // Retornar Usuario
      const [publicUser] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, username FROM authUser WHERE username = ?;',
        [username]
      )
      return publicUser[0]
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al crear usuario.' })
    }
  }

  static async login ({ username, password }) {
    try {
      // Buscar usuario
      const [user] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, username, password FROM authUser WHERE username = ?;',
        [username])
      if (user.length < 0) {
        throw new Error('Usuario no encontrado')
      }

      // Verificar Password
      const isValid = await bcrypt.compare(password, user[0].password)
      if (!isValid) throw new Error('Password is invalid')
      const { id } = user[0]
      return { id, username }
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al logear el usuario.' })
    }
  }

  static async uploadProfileImage ({ url, username }) {
    try {
      await connection.query(
        'UPDATE authUser SET profile_image = ? WHERE username = ?;',
        [url, username]
      )
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al actualizar la imagen de perfil.' })
    }
  }

  static async recoverImageProfile ({ username }) {
    try {
      const [result] = await connection.query(
        'SELECT profile_image FROM authUser WHERE username = ?',
        [username]
      )

      return result[0].profile_image
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al encontrar ImageProfile.' })
    }
  }
}

export class MessageChat {
  static async create ({ msg, username }) {
    try {
      await connection.query(
        'INSERT INTO messages (content, user) VALUES (?, ?);',
        [msg, username]
      )
      // Retornar Usuario
      const [user] = await connection.query(
        `
        SELECT * FROM messages
        WHERE user = ?
        ORDER BY id DESC
        LIMIT 1;`,
        [username]
      )
      return user[0]
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al crear nuevo mensaje.' })
    }
  }

  static async lastInsertRowId () {
    try {
      const [rows] = await connection.query(
        'SELECT id FROM messages ORDER BY id DESC LIMIT 1;'
      )
      return rows[0]
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al encontrar el último mensaje.' })
    }
  }

  static async getId ({ serverOffset }) {
    try {
      const [id] = await connection.query(
        `SELECT messages.id, messages.created_at, messages.content, messages.user,
        authUser.profile_image 
        FROM messages
        JOIN authUser ON messages.user = authUser.username
        WHERE messages.id > ?`, [serverOffset]
      )
      return id
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al encontrar el id.' })
    }
  }

  static async uploadCountMessages ({ username }) {
    try {
      await connection.query(
      `INSERT INTO countMessages (user, count)
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE count = count + 1;`,
      [username])
    } catch (err) {
      console.log('Error', err.message)
      throw new Error({ success: false, message: 'Error al actualizar el contador de mensajes.' })
    }
  }

  static async getCountMessages () {
    try {
      const [result] = await connection.query(
      `SELECT c.user, c.count, a.profile_image
      FROM countMessages c
      JOIN authUser a
      ON a.username = c.user
      ;`)

      return result
    } catch (err) {
      throw new Error({ success: false, message: 'Error al obtener el contador de mensajes.' })
    }
  }

  static async clearChat () {
    try {
      await connection.query(
        'TRUNCATE TABLE messages;'
      )
    } catch (e) {
      throw new Error({ success: false, message: 'Error Clear Chat' })
    }
  }
}
