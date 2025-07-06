import { Button } from "@/components/atoms/button";

interface StartBlockProps {
  onStart: () => void
}

export function StartBlock({ onStart }: StartBlockProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-left mb-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">How It Works:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Start typing when you're ready - timing begins with your first keystroke</li>
          <li>Characters will be color-coded: green for correct (<span className="text-green-500">✓</span>), red for incorrect (<span className="text-red-500">✗</span>)</li>
          <li>You can restart anytime if you're unhappy with your attempt</li>
        </ul>
      </div>
      <Button onClick={onStart}>Start Session</Button>
    </div>
  )
}