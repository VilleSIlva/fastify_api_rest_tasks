import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import z from 'zod'

export async function transactionRoute(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')
    return { transactions }
  })

  app.get('/:id', async (request) => {
    const getTransactionsParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)
    const transaction = await knex('transactions')
      .where('id', id)
      .select('*')
      .first()

    return {
      transaction,
    }
  })

  app.get('/sumary', async () => {
    const sumary = await knex('transactions')
      .sum('amount', { as: 'sumary' })
      .first()

    return { sumary }
  })

  app.post('/', async (request, response) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    })

    const { title, amount, type } = createTransactionsBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      response.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * 1,
      session_id: sessionId,
    })

    return response.status(201).send()
  })
}
