import HighlightParagraph from "@/components/molecules/highlightParagraph"
import { Textarea } from "@/components/atoms/textarea"
import { Button } from "@/components/atoms/button"
import { useNavigate } from "@tanstack/react-router"
import { useSession } from "@/hooks/useSession"
import { useSessionForm } from "@/hooks/useSessionForm"

function TypingBlock() {
  const navigate = useNavigate()
  const { paragraph, sessionId } = useSession()
  const form = useSessionForm(sessionId, (data) => {
    console.log(data)
  })

  const inputValue = form.store.subscribe(({ currentVal }) => currentVal.values.input)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <h1 className="text-2xl font-bold text-center mb-8">Session: {sessionId}</h1>

      <form.Field name="input" children={(field) => (
        <>
          <HighlightParagraph 
            paragraph={paragraph.content} 
            userInput={field.state.value} 
          />
          <Textarea
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            className="mb-10" placeholder="start typing to start the session"
            onChange={(e) => field.handleChange(e.target.value)}
          />
        </>
      )} />
      <div className="flex justify-center gap-4">
        <Button 
          variant="destructive" 
          onClick={() => navigate({ to: '/' })}
        >
          Cancel
        </Button>
        <Button>Re-Start</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

export default TypingBlock