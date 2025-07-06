import { getRamdomParagraphs } from '@/actions/paragraphs'
import { Container } from '@/components/atoms/container'
import TypingBlock from '@/components/organisms/typingBlock'
import { SessionProvider } from '@/store/sessionStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/session/$slug')({
  loader: async ({ params }) => {
    if (!params.slug) {
      throw new Error('Session ID is required')
    }

    const paragraph = await getRamdomParagraphs();

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