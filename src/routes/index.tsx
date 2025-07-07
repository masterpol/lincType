import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Container } from '@/components/atoms/container'
import { Title } from '@/components/atoms/title'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { getListLeaderBoard } from '@/actions/leaderboard'
import { LeaderboardTable } from '@/components/molecules/leaderBoardTable'
import { StartBlock } from '@/components/molecules/startBlock'
import { generateSessionId } from '@/lib/utils'

const dataLoader = createServerFn({ method: 'GET' }).handler(async () => {
  const leaderBoard = await getListLeaderBoard()

  return {
    leaderBoard,
  }
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await dataLoader(),
})

function Home() {
  const navigate = useNavigate()
  const { leaderBoard } = Route.useLoaderData()

  const redirectToSession = () => {
    // FIXME: have some probles with ssr change to this instead for now
    window.location.href = `/session/${generateSessionId()}` 
  }

  return (
    <Container width="narrow">
      <Title variant="main">
        Test Your Typing Speed, Scrub!
      </Title>
      <div className="flex justify-center py-5">
        <Tabs defaultValue="session" className="w-full">
          <TabsList className="justify-center">
            <TabsTrigger value="session">New Session</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="session" className="flex flex-col items-center">
            <StartBlock onStart={() => redirectToSession()} />
          </TabsContent>
          <TabsContent value="leaderboard" className="text-center">
            <LeaderboardTable data={leaderBoard} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
