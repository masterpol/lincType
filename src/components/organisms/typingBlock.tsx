import type { FormEvent } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-form"
import { useSession } from "@/hooks/useSession"
import { useSessionForm } from "@/hooks/useSessionForm"
import { SESSION_STATUS } from "@/lib/constants"
import HighlightParagraph from "@/components/molecules/highlightParagraph"
import { Textarea } from "@/components/atoms/textarea"
import { Button } from "@/components/atoms/button"
import { Title } from "@/components/atoms/title"
import { useTyperTimer } from "@/hooks/useTimer"

function TypingBlock() {
  const navigate = useNavigate()
  const { paragraph, sessionId } = useSession()
  const form = useSessionForm(sessionId, paragraph.id)
  const timer = useTyperTimer()

  const formStatus = useStore(form.store, ({ values }) => values.formStatus)
  const isTouched = useStore(form.store, ({ isTouched }) => isTouched)

  const handleDelete = (valueToAdd: number) => {
    form.setFieldValue('deletes', form.getFieldValue('deletes') + valueToAdd)
  }

  const resetForm = () => {
    form.setFieldValue('formStatus', SESSION_STATUS.NOT_STARTED)
    form.reset()
    timer.restart()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    timer.pause()
    form.setFieldValue('formStatus', SESSION_STATUS.FINISHED)
    form.setFieldValue('totalSeconds', timer.totalSeconds)
    form.handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Title className="text-2xl font-bold text-center mb-8">Current Session Time</Title>
      <div className="flex justify-center items-center mb-8 font-mono">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-6 py-3 text-3xl font-semibold tabular-nums">
          {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
        </div>
      </div>
      <form.Field name="input" children={(field) => (
        <>
          <HighlightParagraph 
            paragraph={paragraph.content} 
            userInput={field.state.value} 
          />
          {
            formStatus !== SESSION_STATUS.FINISHED && (
              <Textarea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                className="mb-10" placeholder="start typing to start the session"
                onChange={(e) => {
                  if(!timer.isRunning) {
                    form.setFieldValue('formStatus', SESSION_STATUS.STARTED)
                    timer.start()
                  }

                  if (e.target.value.length < field.state.value.length) {
                    handleDelete(field.state.value.length - e.target.value.length)
                  }

                  field.handleChange(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isTouched) {
                      handleSubmit(e);
                    }
                  }
                }}
                maxLength={paragraph.content.length}
              />
            )
          }
        </>
      )} />
      <div className="flex justify-center gap-4">
        <Button
          type="button"
          variant="destructive" 
          onClick={() => navigate({ to: '/' })}
        >
          Cancel
        </Button>
        <Button type="button" onClick={resetForm}>Re-Start</Button>
        <Button type="submit" disabled={!isTouched || formStatus === SESSION_STATUS.FINISHED}>Save</Button>
      </div>
    </form>
  )
}

export default TypingBlock