import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbTemp: Awaited<ReturnType<typeof open>> | undefined = undefined;

async function initDb() {
  if (!dbTemp) {
    dbTemp = await open({
      filename: './db.sqlite',
      driver: sqlite3.Database
    });
    
    await dbTemp.exec(`
      CREATE TABLE IF NOT EXISTS paragraphs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        content TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        sessionId TEXT NOT NULL,
        paragraphName TEXT NOT NULL,
        paragraphId TEXT NOT NULL,
        FOREIGN KEY (paragraphId) REFERENCES paragraphs(id)
      );
    `);
  }
  return dbTemp;
}

export const db = await initDb();