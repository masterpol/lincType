import { SESSION_STATUS } from '@/lib/constants'
import { useForm } from '@tanstack/react-form'

interface SessionForm {
  input: string
  sessionId: string
  deletes: number,
  formStatus: typeof SESSION_STATUS[keyof typeof SESSION_STATUS],
  paragraphId: string,
  totalSeconds: number
}

export function useSessionForm(sessionId: string, paragraphId: string) {
  const form = useForm({
    defaultValues: {
      sessionId,
      input: '',
      deletes: 0,
      formStatus: SESSION_STATUS.NOT_STARTED,
      paragraphId,
      totalSeconds: 120,
    } as SessionForm,
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  return form
}