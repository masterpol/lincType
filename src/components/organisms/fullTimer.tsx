import { useSessionForm } from "@/hooks/useSessionForm";
import { useTyperTimer } from "@/hooks/useTimer"
import { SESSION_STATUS } from "@/lib/constants";
import { useStore } from "@tanstack/react-form";
import { memo, useEffect } from "react";
import { Timer } from "../atoms/timer";

function FullTimer({ form }: { form: ReturnType<typeof useSessionForm> }) {
  const { minutes, seconds, pause, restart, totalSeconds, isRunning, start } = useTyperTimer()

  const formStatus = useStore(form.store, ({ values }) => values.formStatus)

  useEffect(() => {
      if (minutes === 0 && seconds === 0 && formStatus === SESSION_STATUS.STARTED) {
        pause()
        form.setFieldValue('formStatus', SESSION_STATUS.FINISHED)
        form.setFieldValue('totalSeconds', totalSeconds)
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
          form.setFieldValue('totalSeconds', totalSeconds)
        }
        break;
      case SESSION_STATUS.NOT_STARTED:
        if (isRunning) {
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

export default memo(FullTimer)