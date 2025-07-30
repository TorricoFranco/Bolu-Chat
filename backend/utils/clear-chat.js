import cron from 'node-cron'
import { MessageChat } from '../models/mysql/auth-user.model.js'

const clearChat = async () => {
  try {
    await MessageChat.clearChat()
    console.log('Se limpio el chat')
  } catch (err) {
    return err
  }
}

cron.schedule('0 0 * * *', clearChat, {
  timezone: 'America/Argentina/Buenos_Aires'
})
