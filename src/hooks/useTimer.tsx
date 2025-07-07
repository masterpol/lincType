import { useTimer } from 'react-timer-hook';

export const returnTwoMinutes = () => {
  const time = new Date();
  time.setMinutes(time.getMinutes() + 2);

  return time;
};

export function useTyperTimer() {
  const {
    totalSeconds,
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart: defaultRestart,
  } = useTimer({ expiryTimestamp: returnTwoMinutes(), onExpire: () => console.warn('onExpire called'), autoStart: false });

  const restart = () => {
    defaultRestart(returnTwoMinutes(), false)
  }

  return {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
    totalSeconds
  }
}