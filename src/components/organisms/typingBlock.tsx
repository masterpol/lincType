import { useEffect, type FormEvent } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-form"
import { useSession } from "@/hooks/useSession"
import { useSessionForm } from "@/hooks/useSessionForm"
import { useTyperTimer } from "@/hooks/useTimer"
import { SESSION_STATUS } from "@/lib/constants"
import HighlightParagraph from "@/components/molecules/highlightParagraph"
import { Textarea } from "@/components/atoms/textarea"
import { Button } from "@/components/atoms/button"
import { Title } from "@/components/atoms/title"
import { Input } from "@/components/atoms/input"

function TypingBlock() {
  const navigate = useNavigate()
  const { paragraph, sessionId } = useSession()
  const form = useSessionForm(sessionId, paragraph)
  const timer = useTyperTimer()

  const formStatus = useStore(form.store, ({ values }) => values.formStatus)
  const isTouched = useStore(form.store, ({ isTouched }) => isTouched)

  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0 && formStatus === SESSION_STATUS.STARTED) {
      timer.pause()
      form.setFieldValue('formStatus', SESSION_STATUS.FINISHED)
      form.setFieldValue('totalSeconds', timer.totalSeconds)
    }
  }, [timer.minutes, timer.seconds, formStatus]);

  const handleDelete = (valueToAdd: number) => {
    form.setFieldValue('deletes', form.getFieldValue('deletes') + valueToAdd)
  }

  const resetForm = () => {
    timer.restart()
    form.setFieldValue('formStatus', SESSION_STATUS.NOT_STARTED)
    form.reset()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    timer.pause()
    form.setFieldValue('formStatus', SESSION_STATUS.FINISHED)
    form.setFieldValue('totalSeconds', timer.totalSeconds)

    if(!form.getFieldValue('userName')) {
      return;
    }

    form.handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit} role="form">
      <Title className="text-2xl font-bold text-center mb-8">Current Session: {paragraph.name}</Title>
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
                role="textbox"
              />
            )
          }
        </>
      )} />
      {formStatus === SESSION_STATUS.FINISHED && (
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <Title variant="sub">Congratulation you finish, save yor score</Title>
          <form.Field name="userName" children={(field) => (
            <Input
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter your name"
              className="mb-4"
              autoFocus
              min={3}
              max={10}
            />
          )} />
        </div>
      )}
      <div className="flex justify-center gap-4">
        <Button
          type="button"
          variant="destructive" 
          onClick={() => navigate({ to: '/' })}
        >
          Cancel
        </Button>
        <Button type="button" disabled={!isTouched} onClick={resetForm}>Re-Start</Button>
        <Button type="submit" disabled={!isTouched}>
          {formStatus === SESSION_STATUS.FINISHED ? 'Save' : 'finish'}
        </Button>
      </div>
    </form>
  )
}

export default TypingBlock