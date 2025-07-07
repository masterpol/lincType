interface ScoreCalculationParams {
  input: string;
  totalSeconds: number;
  deletes: number;
  originalText: string;
}

export function scorecoreCalculation({ input, totalSeconds, deletes, originalText }: ScoreCalculationParams) {
  const wordsTyped = input.trim().split(/\s+/).length;

  // For a 2-minute timer, convert remaining seconds to elapsed time
  const elapsedSeconds = 120 - totalSeconds; // 120 seconds = 2 minutes
  const minutes = elapsedSeconds / 60;
  const wpm = Math.round(wordsTyped / minutes);

  const correctCharacters = input.split('').filter((char, index) => char === originalText[index]).length;
  const accuracy = correctCharacters / originalText.length;

  const score = Math.max(0, Math.round((wpm * wordsTyped * accuracy) - deletes));

  return { score, accuracy };
}
