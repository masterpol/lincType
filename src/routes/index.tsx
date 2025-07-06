import { useRouter, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Container } from '@/components/atoms/container'
import { Title } from '@/components/atoms/title'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { getListLeaderBoard } from '@/actions/leaderboard'
import { LeaderboardTable } from '@/components/molecules/leaderBoardTable'
import { StartBlock } from '@/components/molecules/startBlock'

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
  const router = useRouter()
  const { leaderBoard } = Route.useLoaderData()

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
            <StartBlock onStart={() => null} />
          </TabsContent>
          <TabsContent value="leaderboard" className="text-center">
            <LeaderboardTable data={leaderBoard} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
