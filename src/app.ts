import fastify from 'fastify'
import { transactionRoute } from './routes/transactions'
import cookies from '@fastify/cookie'

const app = fastify()

app.register(cookies)
app.register(transactionRoute, {
  prefix: '/transactions',
})

export { app }
