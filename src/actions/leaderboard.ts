export type leaderBoardItem = {
  name: string
  score: number
  sessionId: string
  paragraphName: string
  paragraphId: string
}

// TODO: temporal data first
const temporalData: leaderBoardItem[] = [
  {
    name: 'Poldon1',
    score: 100,
    sessionId: '1234567890',
    paragraphName: 'paragraph1',
    paragraphId: '1234567890'
  },
  {
    name: 'Poldo2',
    score: 100,
    sessionId: '1234567890',
    paragraphName: 'paragraph2',
    paragraphId: '1234567890'
  }, 
]

export async function getListLeaderBoard(pages = 10): Promise<leaderBoardItem[]> {
  return temporalData
}

export async function setLeaderBoardItem(item: leaderBoardItem): Promise<void> {
  temporalData.push(item);
}