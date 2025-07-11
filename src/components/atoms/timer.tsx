import { memo } from "react"

type TimerProps = {
  minutes: number
  seconds: number
}

function TimerBase({ minutes, seconds }: TimerProps) {
  return (
    <div className="flex justify-center items-center mb-8 font-mono">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-6 py-3 text-3xl font-semibold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  )
}

const Timer = memo(TimerBase)

export { Timer }