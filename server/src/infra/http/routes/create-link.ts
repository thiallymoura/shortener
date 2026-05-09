import { createLink } from '@/app/functions/create-link'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a short link',
        tags: ['links'],
        body: z.object({
          originalUrl: z.string(),
          shortUrl: z.string(),
        }),
        response: {
          201: z.object({
            id: z.string(),
            originalUrl: z.string(),
            shortUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
          400: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const result = await createLink({
        originalUrl,
        shortUrl,
      })

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result))
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidOriginalUrl':
        case 'InvalidShortUrlFormat':
          return reply.status(400).send({ message: error.message })
        case 'ShortUrlAlreadyExists':
          return reply.status(409).send({ message: error.message })
      }
    }
  )
}
