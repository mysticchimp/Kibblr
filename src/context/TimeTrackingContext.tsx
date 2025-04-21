import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TimeRecord {
  id: string;
  activityType: string;
  duration: number;
  endTime: string;
}

interface TimeTrackingContextType {
  records: TimeRecord[];
  addRecord: (record: Omit<TimeRecord, 'id'>) => void;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined);

export const TimeTrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<TimeRecord[]>([]);

  const addRecord = (record: Omit<TimeRecord, 'id'>) => {
    console.log('Adding new record:', record);
    const newRecord: TimeRecord = {
      ...record,
      id: Date.now().toString(),
    };
    console.log('New record with ID:', newRecord);
    setRecords(prev => {
      const updatedRecords = [...prev, newRecord];
      console.log('Updated records:', updatedRecords);
      return updatedRecords;
    });
  };

  return (
    <TimeTrackingContext.Provider value={{ records, addRecord }}>
      {children}
    </TimeTrackingContext.Provider>
  );
};

export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (context === undefined) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  }
  return context;
}; 