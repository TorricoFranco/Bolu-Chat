import express from 'express'
import { PORT } from './config.js'
import { routerIndex } from './router/index.router.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from 'morgan'
import './utils/clear-chat.js'
import { configureSocket } from './socket/index.js'

// MIDDLEWARES
import { authMiddleware } from './middleware/authMiddleware.js'
import { serveUploads } from './middleware/serverUpMiddleware.js'
import { checkImageExists } from './middleware/checkImageExists.js'

const app = express()

app.use('/uploads', checkImageExists, serveUploads)

app.set('view engine', 'ejs')
app.set('views', '../frontend/views')
app.locals.API_URL = process.env.FRONTEND_API_URL

app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use(logger('dev'))
app.use(authMiddleware)

routerIndex(app)

// socket

const server = configureSocket(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${process.env.FRONTEND_API_URL}`)
})
