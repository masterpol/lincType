import type { leaderBoardItem } from "@/actions/leaderboard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"
import { Title } from "../atoms/title"
import { memo } from "react"

interface LeaderboardTableProps {
  data: leaderBoardItem[]
}

function LeaderboardTableBase({ data }: LeaderboardTableProps) {
  if (data.length === 0) {
    return (
      <Title variant="sub">No items found yet. Keep practicing your typing skills!</Title>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Paragraph</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={`${item.sessionId}-${item.paragraphId}`}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.score}</TableCell>
            <TableCell>{item.paragraphName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const LeaderboardTable = memo(LeaderboardTableBase)