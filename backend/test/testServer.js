import express from 'express'
import supertest from 'supertest'

export function testServer (router) {
  const app = express()
  router(app)
  return supertest(app)
}
