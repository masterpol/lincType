import { createContext, ReactNode } from 'react';
import type { Paragraph } from "@/actions/paragraphs";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface SessionContextType {
  paragraph: Paragraph
  sessionId: string
}

interface SessionProviderProps {
  children: ReactNode
  paragraph?: Paragraph
  sessionId: string
}


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children, paragraph, sessionId }: SessionProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext value={{ paragraph, sessionId }}>
        {children}
      </SessionContext>
    </QueryClientProvider>
  )
}