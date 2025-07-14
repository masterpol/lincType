import { useTyperTimer } from "@/hooks/useTimer"
import { SESSION_STATUS } from "@/lib/constants";
import { memo, useEffect } from "react";
import { Timer } from "@/components/atoms/timer";

type FullTimerProps = {
  formStatus: typeof SESSION_STATUS[keyof typeof SESSION_STATUS],
  setFormStatus: (status: (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS]) => void,
  setTotalSeconds: (seconds: number) => void,
}

function FullTimerBase({ formStatus, setTotalSeconds, setFormStatus }: FullTimerProps) {
  const {
    minutes,
    seconds,
    totalSeconds,
    isRunning,
    pause,
    restart,
    start
  } = useTyperTimer()

  useEffect(() => {
      if (minutes === 0 && seconds === 0 && formStatus === SESSION_STATUS.STARTED) {
        pause()
        setFormStatus(SESSION_STATUS.FINISHED)
        setTotalSeconds(totalSeconds)
      }
    }, [minutes, seconds, formStatus])

  useEffect(() => {
    switch (formStatus) {
      case SESSION_STATUS.STARTED:
        if (!isRunning) {
          start()
        }
        break;
      case SESSION_STATUS.FINISHED:
        if (isRunning) {
          pause()
          setTotalSeconds(totalSeconds)
        }
        break;
      case SESSION_STATUS.NOT_STARTED:
        if (isRunning || minutes > 0 || seconds > 0) {
          restart()
        }
        break;
      default:
        break;
    }
  }, [formStatus])

  return (
    <Timer minutes={minutes} seconds={seconds} />
  )
}

export const FullTimer = memo(FullTimerBase)
