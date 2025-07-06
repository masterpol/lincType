import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ANIMATION_STATUS, HIGHLIGHT_STATUS, POSITION_STATUS, STYLE_CLASSES } from "@/lib/constants"
import { useMemo } from "react"

interface HighlightParagraphProps {
  paragraph: string
  userInput: string
}

type HighlightType = typeof HIGHLIGHT_STATUS[keyof typeof HIGHLIGHT_STATUS]
type PositionType = typeof POSITION_STATUS[keyof typeof POSITION_STATUS]
type AnimationType = typeof ANIMATION_STATUS[keyof typeof ANIMATION_STATUS]

const getHighlight = (char: string, comparisonChar: string | undefined): HighlightType => {
  if (!comparisonChar) return HIGHLIGHT_STATUS.NONE
  return char === comparisonChar ? HIGHLIGHT_STATUS.CORRECT : HIGHLIGHT_STATUS.INCORRECT
}

const getPosition = (isFirst: boolean, isLast: boolean): PositionType => {
  if (isFirst) return POSITION_STATUS.START
  if (isLast) return POSITION_STATUS.END
  return POSITION_STATUS.MIDDLE
}

const getAnimation = (isLastTyped: boolean, isNextChar: boolean): AnimationType => {
  if (isLastTyped) return ANIMATION_STATUS.LAST_TYPED
  if (isNextChar) return ANIMATION_STATUS.NEXT_CHAR
  return ANIMATION_STATUS.NONE
}

const characterVariants = cva(
  STYLE_CLASSES.BASE, 
  {
    variants: {
      highlight: {
        [HIGHLIGHT_STATUS.CORRECT]: STYLE_CLASSES.CORRECT,
        [HIGHLIGHT_STATUS.INCORRECT]: STYLE_CLASSES.INCORRECT,
        [HIGHLIGHT_STATUS.NONE]: STYLE_CLASSES.NONE
      },
      position: {
        [POSITION_STATUS.START]: STYLE_CLASSES.ROUNDED_LEFT,
        [POSITION_STATUS.END]: STYLE_CLASSES.ROUNDED_RIGHT,
        [POSITION_STATUS.MIDDLE]: STYLE_CLASSES.NONE,
      },
      animation: {
        [ANIMATION_STATUS.LAST_TYPED]: "animate-character-pop",
        [ANIMATION_STATUS.NEXT_CHAR]: "border-b-2 border-blue-500",
        [ANIMATION_STATUS.NONE]: STYLE_CLASSES.NONE
      }
    },
    defaultVariants: {
      highlight: HIGHLIGHT_STATUS.NONE,
      position: POSITION_STATUS.MIDDLE,
      animation: ANIMATION_STATUS.NONE
    }
  }
)

function HighlightParagraph({ paragraph, userInput }: HighlightParagraphProps) {
  const lastUserInputPosition = useMemo(() => userInput.length - 1, [userInput])
  const lastPosition = paragraph.length - 1

  const highlightText = () => paragraph.split('')
    .map((char, index) => {
      const comparisonChar = userInput[index]
      const isFirst = index === 0
      const isLast = index === lastPosition
      const isLastTyped = index === lastUserInputPosition
      const isNextChar = index === lastUserInputPosition + 1

      return (
        <span 
          key={index} 
          className={cn(
            characterVariants({ 
              highlight: getHighlight(char, comparisonChar),
              position: getPosition(isFirst, isLast),
              animation: getAnimation(isLastTyped, isNextChar)
            })
          )}
        >
          {char}
        </span>
      )
    })

  return (
    <div className="p-4">
      <p className="text-lg mb-2 font-mono">{highlightText()}</p>
    </div>
  )
}

export default HighlightParagraph
