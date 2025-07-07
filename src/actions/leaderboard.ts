import { db } from "@/db"

export type leaderBoardItem = {
  id?: string
  name: string
  score: number
  sessionId: string
  paragraphName: string
  paragraphId: string
}

export async function getListLeaderBoard(limit = 10): Promise<leaderBoardItem[]> {
  return db.all(`
    SELECT name, score, sessionId, paragraphName, paragraphId 
    FROM leaderboard 
    ORDER BY score DESC, name ASC
    LIMIT ?
  `, [limit]) as Promise<leaderBoardItem[]>;
}

export async function setLeaderBoardItem(item: leaderBoardItem): Promise<void> {
  await db.run(`
    INSERT INTO leaderboard (name, score, sessionId, paragraphName, paragraphId)
    VALUES (?, ?, ?, ?, ?)
  `, [
    item.name,
    item.score,
    item.sessionId,
    item.paragraphName,
    item.paragraphId
  ]);
}