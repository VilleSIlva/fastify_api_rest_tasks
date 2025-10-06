import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import z from 'zod'
import { checkCookieExist } from '../middlewares/check-cookie-exist'

export async function transactionRoute(app: FastifyInstance) {
  app.get('/', { preHandler: [checkCookieExist] }, async (req) => {
    const { sessionId } = req.cookies
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select('*')
    return { transactions }
  })

  app.get('/:id', { preHandler: [checkCookieExist] }, async (req) => {
    const { sessionId } = req.cookies
    const getTransactionsParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(req.params)
    const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .select('*')
      .first()

    return {
      transaction,
    }
  })

  app.get('/sumary', { preHandler: [checkCookieExist] }, async (req) => {
    const { sessionId } = req.cookies
    const sumary = await knex('transactions')
      .where('session_id', sessionId)
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
