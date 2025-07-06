export type Paragraph = {
  id: string
  name: string
  content: string
}

// TODO: temporal data first
const temporalData: Paragraph[] = [
    {
      id: '1234567890',
      name: 'paragraph1',
      content: 'This is the sentence to type'
    },
    {
      id: '1234567890',
      name: 'paragraph2',
      content: 'This is the sentence to type, longer sentence'
    }
]

export async function getRamdomParagraphs(): Promise<Paragraph> {
  return temporalData[Math.floor(Math.random() * temporalData.length)]
}