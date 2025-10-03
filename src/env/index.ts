import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success !== true) {
  console.error('Invalid environment variables!', _env.error.format)
  throw new Error('Invalid environment variables!')
}

export const env = _env.data
