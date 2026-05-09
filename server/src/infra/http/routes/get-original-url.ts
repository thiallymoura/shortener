import { getOriginalUrl } from '@/app/functions/get-original-url'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/:shortUrl',
    {
      schema: {
        summary: 'Get original URL by short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.object({
            originalUrl: z.string(),
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await getOriginalUrl({ shortUrl })

      if (isRight(result)) {
        return reply.status(200).send(unwrapEither(result))
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidShortUrlFormat':
          return reply.status(400).send({ message: error.message })
        case 'LinkNotFound':
          return reply.status(404).send({ message: error.message })
      }
    }
  )
}
