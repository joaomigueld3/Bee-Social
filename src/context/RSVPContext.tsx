import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bee_social_rsvp';

interface RSVPContextValue {
  confirmedEventIds: Set<string>;
  confirmedCount: number;
  isAttending: (id: string) => boolean;
  toggleAttendance: (id: string) => void;
}

const RSVPContext = createContext<RSVPContextValue>({
  confirmedEventIds: new Set(),
  confirmedCount: 0,
  isAttending: () => false,
  toggleAttendance: () => {},
});

function loadConfirmed(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

export function RSVPProvider({ children }: { children: React.ReactNode }) {
  const [confirmedEventIds, setConfirmedEventIds] = useState<Set<string>>(loadConfirmed);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...confirmedEventIds]));
    } catch {}
  }, [confirmedEventIds]);

  const toggleAttendance = useCallback((id: string) => {
    setConfirmedEventIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<RSVPContextValue>(() => ({
    confirmedEventIds,
    confirmedCount: confirmedEventIds.size,
    isAttending: (id: string) => confirmedEventIds.has(id),
    toggleAttendance,
  }), [confirmedEventIds, toggleAttendance]);

  return <RSVPContext.Provider value={value}>{children}</RSVPContext.Provider>;
}

export const useRSVP = () => useContext(RSVPContext);
