import { useForm } from '@tanstack/react-form'

interface SessionForm {
  input: string
  sessionId: string
  deletes: number
}

export function useSessionForm(sessionId: string, onSave: (data: SessionForm) => void) {
  const form = useForm({
    defaultValues: {
      sessionId,
      input: '',
      deletes: 0,
    } as SessionForm,
    onSubmit: ({ value }) => {
      onSave(value);
    },
  })

  const addToDeletes = () => {
    form.setFieldValue('deletes', (prev) => prev + 1)
  }

  return form
}