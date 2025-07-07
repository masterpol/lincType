import { createServerFileRoute } from '@tanstack/react-start/server'
import { leaderBoardSchema, setLeaderBoardItem } from '@/actions/leaderboard'
import { ZodError } from 'zod'

export const ServerRoute = createServerFileRoute('/result').methods({
  POST: async ({ request }) => {
    const body = await request.json()
    try {
      const validated = leaderBoardSchema.parse(body)

      const result = await setLeaderBoardItem(validated)
      return new Response(JSON.stringify(result))
    } catch (error) {
      if (error instanceof ZodError) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
      }
    }
    return new Response(JSON.stringify({ message: `Hello, ${body.name}!` }))
  },
})