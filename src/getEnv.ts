import { z } from 'zod'
import dotenv from 'dotenv'

const envSchema = z.object({
  DISCORD_BOT_TOKEN: z.string().nonempty(),
  SERVER_ID: z.string().nonempty(),
  CLIENT_ID: z.string().nonempty(),
  NODE_ENV: z.enum(['production', 'development']),
})
dotenv.config()

export function getEnv() {
  const env = envSchema.parse(process.env)
  return env
}
