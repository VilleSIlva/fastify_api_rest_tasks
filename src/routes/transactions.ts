import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import z from 'zod'

export async function transactionRoute(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    })

    const { title, amount, type } = createTransactionsBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * 1,
    })

    return response.status(201).send()
  })
}
