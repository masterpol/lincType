import { db } from "@/db"
import z from "zod"

export const leaderBoardSchema = z.object({
  name: z.string().min(1),
  score: z.number().gte(0) ,
  sessionId: z.string().min(1),
  paragraphName: z.string().min(1),
  paragraphId: z.string().min(1),
  accuracy: z.number().gte(0),
  id: z.string().optional(),
  wpm: z.number().optional(),
})

export type leaderBoardItem = z.infer<typeof leaderBoardSchema>

export async function getListLeaderBoard(limit = 10): Promise<leaderBoardItem[]> {
  return db.all(`
    SELECT name, score, sessionId, paragraphName, paragraphId, accuracy, wpm
    FROM leaderboard 
    ORDER BY score DESC, name ASC
    LIMIT ?
  `, [limit]) as Promise<leaderBoardItem[]>;
}

export async function setLeaderBoardItem(item: leaderBoardItem): Promise<leaderBoardItem> {
  await db.run(`
    INSERT INTO leaderboard (name, score, sessionId, paragraphName, paragraphId, accuracy, wpm)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    item.name,
    item.score,
    item.sessionId,
    item.paragraphName,
    item.paragraphId,
    item.accuracy,
    item.wpm
  ]);

  const result = await db.get(`
    SELECT id, name, score, sessionId, paragraphName, paragraphId, accuracy, wpm
    FROM leaderboard
    WHERE rowid = last_insert_rowid()
  `) as leaderBoardItem;

  return result;
}

export async function getLeaderBoardBySessionId(sessionId: string): Promise<leaderBoardItem | undefined> {
  const results = await db.all(`
    SELECT id, name, score, sessionId, paragraphName, paragraphId, accuracy, wpm
    FROM leaderboard
    WHERE sessionId = ?
    ORDER BY score DESC, name ASC
    LIMIT 1
  `, [sessionId]) as leaderBoardItem[];

  return results[0] || undefined;
}