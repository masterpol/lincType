import { createContext, ReactNode } from 'react';
import type { Paragraph } from "@/actions/paragraphs";

interface SessionContextType {
  paragraph: Paragraph
  sessionId: string
}

interface SessionProviderProps {
  children: ReactNode
  paragraph: Paragraph
  sessionId: string
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children, paragraph, sessionId }: SessionProviderProps) {
  return (
    <SessionContext value={{ paragraph, sessionId }}>
      {children}
    </SessionContext>
  )
}