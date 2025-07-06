import type { leaderBoardItem } from "@/actions/leaderboard"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table"

interface LeaderboardTableProps {
  data: leaderBoardItem[]
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
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