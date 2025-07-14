import { type FormEvent } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-form"
import { useSession } from "@/hooks/useSession"
import { useSessionForm } from "@/hooks/useSessionForm"
import { SESSION_STATUS } from "@/lib/constants"
import HighlightParagraph from "@/components/molecules/highlightParagraph"
import { Textarea } from "@/components/atoms/textarea"
import { Button } from "@/components/atoms/button"
import { Title } from "@/components/atoms/title"
import { Input } from "@/components/atoms/input"
import { FullTimer } from "@/components/organisms/fullTimer"

function TypingBlock() {
  const navigate = useNavigate()
  const { paragraph, sessionId } = useSession()
  const form = useSessionForm(sessionId, paragraph)

  const formStatus = useStore(form.store, ({ values }) => values.formStatus)
  const isTouched = useStore(form.store, ({ isTouched }) => isTouched)

  const handleDelete = (valueToAdd: number) => {
    form.setFieldValue('deletes', form.getFieldValue('deletes') + valueToAdd)
  }

  const setFormStatus = (status: typeof SESSION_STATUS[keyof typeof SESSION_STATUS]) => {
    form.setFieldValue('formStatus', status)
  }

  const setTotalSeconds = (seconds: number) => {
    form.setFieldValue('totalSeconds', seconds)
  }

  const resetForm = () => {
    setFormStatus(SESSION_STATUS.NOT_STARTED)
    form.reset()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormStatus(SESSION_STATUS.FINISHED)

    if(!form.getFieldValue('userName')) {
      return;
    }

    form.handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit} role="form">
      <Title variant="sub" className="font-bold text-center mb-8">
        Current Session:
        <span className="text-blue-500 ml-3">{paragraph.name}</span>
      </Title>
      <FullTimer
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        setTotalSeconds={setTotalSeconds}
      />
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
                  if(field.state.value.length === 0) {
                    form.setFieldValue('formStatus', SESSION_STATUS.STARTED)
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

export default  TypingBlock