import type { leaderBoardItem } from "@/actions/leaderboard";
import { memo } from "react"
import { Title } from "@/components/atoms/title";

type ScoreBlockProps = {
  leaderBoard: leaderBoardItem
}

function ScoreBlock({ leaderBoard }: ScoreBlockProps) {
  return (
    <>
      <Title variant="main">
        Result Sumary of {leaderBoard.name}
      </Title>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 mb-12">
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-600 dark:text-gray-400 text-lg mb-2">Text name</span>
            <span className="text-4xl font-bold font-mono">{leaderBoard.paragraphName}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-gray-600 dark:text-gray-400 text-lg mb-2">Score</span>
            <span className="text-4xl font-bold font-mono">{leaderBoard.score}</span>
          </div>
          
          <div className="w-full h-px bg-slate-300 dark:bg-slate-600"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-gray-600 dark:text-gray-400 text-lg mb-2">Accuracy</span>
            <span className="text-4xl font-bold font-mono">{(leaderBoard.accuracy * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ScoreBlock);