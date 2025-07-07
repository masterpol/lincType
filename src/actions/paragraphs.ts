import { db } from "@/db"

export type Paragraph = {
  id: string
  name: string
  content: string
}

export async function getRamdomParagraphs(): Promise<Paragraph> {
  try {
    const result = await db.get(`
      SELECT id, name, content 
      FROM paragraphs 
      ORDER BY RANDOM() 
      LIMIT 1
    `) as Paragraph;
    
    if (!result) {
      throw new Error('No paragraphs found in database');
    }

    return result;
  } catch (error) {
    console.error('Error fetching paragraphs:', error)
    throw new Error('Failed to fetch paragraphs')
  }
}