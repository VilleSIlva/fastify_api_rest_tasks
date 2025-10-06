import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'
import { test, describe, beforeAll, afterAll, expect } from 'vitest'

beforeAll(async () => {
  execSync('npm run knex -- migrate:rollback --all')
  execSync('npm run knex -- migrate:latest')

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

  test('deve ser possivel listar as transacoes', async () => {
    const responseCreateTransactions = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Title Test',
        amount: 200,
        type: 'credit',
      })
      .expect(201)

    const cookie = responseCreateTransactions.get('Set-Cookie')

    if (!cookie) {
      throw new Error('Cookie não encontrado')
    }

    const response = await request(app.server)
      .get('/transactions')
      .send()
      .set('Cookie', cookie)
      .expect(200)

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Title Test',
        amount: 200,
      }),
    ])
  })

  test('deve ser posiivel listar uma unica transactions pelo id', async () => {
    const responseCreateTransactions = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Title Test',
        amount: 200,
        type: 'credit',
      })
      .expect(201)

    const cookie = responseCreateTransactions.get('Set-Cookie')

    if (!cookie) {
      throw new Error('Cookie não encontrado')
    }

    const transactionsList = await request(app.server)
      .get('/transactions')
      .send()
      .set('Cookie', cookie)
      .expect(200)

    const transaction = transactionsList.body.transactions[0]

    const response = await request(app.server)
      .get(`/transactions/${transaction.id}`)
      .send()
      .set('Cookie', cookie)
      .expect(200)

    expect(response.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Title Test',
        amount: 200,
      }),
    )
  })
})
