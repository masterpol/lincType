import { useRouter, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Button } from '@/components/atoms/button'
import { Container } from '@/components/atoms/container'
import { Title } from '@/components/atoms/title'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { getListLeaderBoard } from '@/actions/leaderboard'
import { LeaderboardTable } from '@/components/molecules/leaderBoardTable'

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
            <div className="text-left mb-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">How It Works:</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Start typing when you're ready - timing begins with your first keystroke</li>
                <li>Characters will be color-coded: green for correct (<span className="text-green-500">✓</span>), red for incorrect (<span className="text-red-500">✗</span>)</li>
                <li>You can restart anytime if you're unhappy with your attempt</li>
              </ul>
            </div>
            <Button onClick={() => null}>Start Session</Button>
          </TabsContent>
          <TabsContent value="leaderboard" className="text-center">
            <LeaderboardTable data={leaderBoard} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
