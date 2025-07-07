import { getLeaderBoardBySessionId } from '@/actions/leaderboard'
import { Button } from '@/components/atoms/button'
import { Container } from '@/components/atoms/container'
import { Title } from '@/components/atoms/title'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const getLeaderBoardBySession = createServerFn({ method: 'GET', response: 'data' })
  .validator((data: unknown) => 
    z.string().parse(data)
  )
  .handler(async ({ data }) => {
    return await getLeaderBoardBySessionId(data)
  })

export const Route = createFileRoute('/result/$slug')({
  loader: async ({ params }) => {
    if (!params.slug) {
      throw new Error('Session ID is required')
    }

    const leaderBoard = await getLeaderBoardBySession({ data: params.slug })

    if(!leaderBoard) {
      throw new Error('Session not found')
    }

    return {
      leaderBoard,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { leaderBoard } = Route.useLoaderData()

  return <Container width="narrow">
    <Title variant="main">
      Result Sumary of {leaderBoard.name}
    </Title>
    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 mb-12">
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center">
          <span className="text-gray-600 dark:text-gray-400 text-lg mb-2">Text name</span>
          <span className="text-4xl font-bold font-mono">{leaderBoard.paragraphName}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-gray-600 dark:text-gray-400 text-lg mb-2">Score</span>
          <span className="text-4xl font-bold font-mono">{leaderBoard.score}</span>
        </div>
        
        <div className="w-full h-px bg-slate-300 dark:bg-slate-600"></div>
        
        <div className="flex flex-col items-center">
          <span className="text-gray-600 dark:text-gray-400 text-lg mb-2">Accuracy</span>
          <span className="text-4xl font-bold font-mono">{(leaderBoard.accuracy * 100).toFixed(2)}%</span>
        </div>
      </div>
    </div>
    <Button type="button" onClick={() => navigate({ to: '/' })}>
      Back to Home
    </Button>
  </Container>
}