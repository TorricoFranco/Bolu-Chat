import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Ping periódico para evitar que Railway cierre la conexión por inactividad
setInterval(async () => {
  try {
    await pool.query('SELECT 1')
  } catch (err) {
    console.error('Error en ping DB:', err)
  }
}, 60000)

export default pool
