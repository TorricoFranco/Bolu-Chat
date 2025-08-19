import dotenv from 'dotenv'

dotenv.config()

export const {
  PORT = 9999,
  SECRET_JWT_KEY,
  REFRESH_TOKEN_KEY,
  VEXOR_PUBLISHABLEKEY,
  VEXOR_PROJECTID,
  VEXOR_SECRETKEY
} = process.env
