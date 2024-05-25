import zenv from 'zennv'
import { z } from 'zod'

const env=zenv({
    dotenv: true,
    schema: z.object({
        PORT: z.number().default(3000),
        HOST: z.string().default('0.0.0.0'),
        DATABASE_CONNECTION: z.string(),
    })
})
export {env};