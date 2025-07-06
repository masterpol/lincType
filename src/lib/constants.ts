export const HIGHLIGHT_STATUS = {
  CORRECT: "correct",
  INCORRECT: "incorrect",
  NONE: "none",
} as const;

export const POSITION_STATUS = {
  START: "start",
  END: "end",
  MIDDLE: "middle",
} as const;

export const ANIMATION_STATUS = {
  LAST_TYPED: "lastTyped",
  NONE: "none",
} as const;

export const STYLE_CLASSES = {
  CORRECT: "bg-green-200",
  INCORRECT: "bg-red-200",
  NONE: "",
  ROUNDED_LEFT: "rounded-l",
  ROUNDED_RIGHT: "rounded-r",
  BASE: "px-0.5 transition-all duration-200",
  CONTAINER: "p-4",
  TEXT: "text-lg mb-2 font-mono",
} as const;