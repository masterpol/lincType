import { getRamdomParagraphs } from '@/actions/paragraphs'
import { Container } from '@/components/atoms/container'
import TypingBlock from '@/components/organisms/typingBlock'
import { SessionProvider } from '@/store/sessionStore'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getLeaderBoardBySessionId } from '@/actions/leaderboard'
import z from 'zod'

const getParagraphs = createServerFn({ method: 'GET', response: 'data' }).handler(async () => {
  return await getRamdomParagraphs()
})

const getLeaderboardBySessionId = createServerFn({ method: 'GET', response: 'data' })
  .validator((data: unknown) => 
    z.string().parse(data)
  )
  .handler(async ({ data }) => {
    return await getLeaderBoardBySessionId(data)
  })

export const Route = createFileRoute('/session/$slug')({
  loader: async ({ params }) => {
    if (!params.slug) {
      throw new Error('Session ID is required')
    }

    const leaderBoard = await getLeaderboardBySessionId({ data: params.slug })

    if(leaderBoard) {
      throw redirect({
        to: '/',
      })
    }

    const paragraph = await getParagraphs()

    return {
      sessionId: params.slug,
      paragraph,
    }
  },
  component: Session,
})

function Session() {
  const { sessionId, paragraph } = Route.useLoaderData()

  if (!sessionId) {
    return <Container width="narrow">Session not found</Container>
  }

  return (
    <Container width="narrow">
      <SessionProvider paragraph={paragraph} sessionId={sessionId}>
        <TypingBlock />
      </SessionProvider>
    </Container>
  )
}