import request from 'supertest'
import { app } from '../app'
import { test, describe, beforeAll, afterAll } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Testar rotas de transactions', () => {
  test('deve ser possivel cadastrar uma transacao', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Title Test',
        amount: 200,
        type: 'credit',
      })
      .expect(201)
  })
})
