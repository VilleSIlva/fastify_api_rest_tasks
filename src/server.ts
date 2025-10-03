import fastify from 'fastify'
import { env } from './env'
import { transactionRoute } from './routes/transactions'

const app = fastify()

app.register(transactionRoute, {
  prefix: '/transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server Running'))
