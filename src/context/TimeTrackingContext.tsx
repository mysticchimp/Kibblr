import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface TimeEntry {
  id: string;
  activityType: string;
  duration: number;
  endTime: string;
}

interface TimeTrackingContextType {
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined);

export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  }
  return context;
};

interface TimeTrackingProviderProps {
  children: ReactNode;
}

export const TimeTrackingProvider: React.FC<TimeTrackingProviderProps> = ({ children }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTimeEntries(prev => [...prev, newEntry]);
  };

  return (
    <TimeTrackingContext.Provider value={{ timeEntries, addTimeEntry }}>
      {children}
    </TimeTrackingContext.Provider>
  );
};

export { TimeTrackingContext }; 