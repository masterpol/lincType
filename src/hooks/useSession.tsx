import { SessionContext } from "@/store/sessionStore";
import { useContext } from "react";

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}