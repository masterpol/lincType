import { SESSION_STATUS } from '@/lib/constants'
import { useForm } from '@tanstack/react-form'
import { scoreCalculation } from '@/lib/scoreCalculation'
import { Paragraph } from '@/actions/paragraphs'
import { redirect, useNavigate } from '@tanstack/react-router'
import type { leaderBoardItem } from '@/actions/leaderboard'

interface SessionForm {
  input: string
  sessionId: string
  deletes: number,
  formStatus: typeof SESSION_STATUS[keyof typeof SESSION_STATUS],
  paragraphId: string,
  totalSeconds: number,
  userName: string | undefined,
}

export function useSessionForm(sessionId: string, paragraph: Paragraph) {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      sessionId,
      input: '',
      deletes: 0,
      formStatus: SESSION_STATUS.NOT_STARTED,
      paragraphId: paragraph.id,
      totalSeconds: 120,
      userName: undefined,
    } as SessionForm,
    onSubmit: async ({ value }) => {
      const score = scoreCalculation({ input: value.input, totalSeconds: value.totalSeconds, deletes: value.deletes, originalText: paragraph.content })

      const body = {
        name: value.userName,
        score: score.score,
        sessionId: value.sessionId,
        paragraphName: paragraph.name,
        paragraphId: value.paragraphId,
        accuracy: score.accuracy,
        wpm: score.wpm
      }

       try {
        const response = await fetch('/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as leaderBoardItem;

        return navigate({
          to: `/result/${data.sessionId}`,
        })
      } catch (error) {
        console.error('Error:', error);
        alert('Error saving result')
        return redirect({
          to: '/',
        })
      }
    },
  })

  return form
}