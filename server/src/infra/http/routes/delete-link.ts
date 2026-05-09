import { deleteLink } from '@/app/functions/delete-link'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links/:shortUrl',
    {
      schema: {
        summary: 'Delete link by short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.null(),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await deleteLink({ shortUrl })

      if (isRight(result)) {
        return reply.status(200).send(null)
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
