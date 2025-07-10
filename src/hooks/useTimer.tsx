import { useState, useEffect, useCallback } from 'react'

const TWO_MINUTES_IN_SECONDS = 120

export const returnTwoMinutes = (serverDate: number) => {
  const time = new Date(serverDate)
  time.setMinutes(time.getMinutes() + 2)
  return time
}

export function useTyperTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TWO_MINUTES_IN_SECONDS)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1))
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false)
    }
  }, [timeLeft])

  const start = useCallback(() => {
    setTimeLeft(TWO_MINUTES_IN_SECONDS)
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    setIsRunning(true)
  }, [])

  const restart = useCallback(() => {
    setTimeLeft(TWO_MINUTES_IN_SECONDS)
    setIsRunning(false)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
    totalSeconds: timeLeft
  }
}