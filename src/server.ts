import fastify from 'fastify'
import { env } from './env'
import { transactionRoute } from './routes/transactions'
import cookies from '@fastify/cookie'

const app = fastify()

app.register(cookies)
app.register(transactionRoute, {
  prefix: '/transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server Running'))
