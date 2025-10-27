import mysql from 'mysql2/promise'

// host: process.env.DB_HOST,
// user: process.env.DB_USER,
// port: process.env.DB_PORT,
// password: process.env.DB_PASS,
// database: process.env.DB_NAME,

const pool = mysql.createPool({
  host: "localhost",
  port: 8888,
  user: "root",
  password: "TorricoGelp22",
  database: "authUserdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const isProduction = process.env.NODE_ENV === 'production'

// Ping periódico solo en producción (Railway)
if (isProduction) {
  setInterval(async () => {
    try {
      await pool.query("SELECT 1")
    } catch (err) {
      console.error("Error en ping DB:", err)
    }
  }, 60000)
}

export default pool

