import { getLeaderBoardBySessionId } from '@/actions/leaderboard'
import { Button } from '@/components/atoms/button'
import ScoreBlock from '@/components/molecules/scoreBlock'
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

  return (
    <>
      <ScoreBlock leaderBoard={leaderBoard} />
      <Button type="button" onClick={() => navigate({ to: '/' })}>
        Back to Home
      </Button>
    </>
  )
}