import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTimeTracking } from '../context/TimeTrackingContext';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const TimerDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
  font-family: monospace;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ActivitySelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 1rem 0;
  width: 100%;
`;

const TimeSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 1rem 0;
  width: 100%;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h2`
  margin: 0 0 1rem 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Timer: React.FC = () => {
  const { addTimeEntry } = useTimeTracking();
  const [selectedTime, setSelectedTime] = useState<number>(60); // Default 60 minutes
  const [timeLeft, setTimeLeft] = useState<number>(selectedTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activityType, setActivityType] = useState<string>('MBA');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(selectedTime * 60);
  }, [selectedTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setShowSaveModal(true);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowSaveModal(true);
  };

  const handleSave = () => {
    const duration = (selectedTime * 60) - timeLeft; // Total time spent
    addTimeEntry({
      activityType,
      duration,
      endTime: new Date().toISOString(),
    });
    setTimeLeft(selectedTime * 60);
    setShowSaveModal(false);
  };

  const handleCancel = () => {
    setShowSaveModal(false);
    setTimeLeft(selectedTime * 60);
  };

  return (
    <TimerContainer>
      <ActivitySelect
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
      >
        <option value="MBA">MBA</option>
        <option value="Business Idea">Business Idea</option>
        <option value="Gym">Gym</option>
        <option value="Cooking">Cooking</option>
        <option value="Job Search">Job Search</option>
      </ActivitySelect>

      <TimeSelect
        value={selectedTime}
        onChange={(e) => setSelectedTime(Number(e.target.value))}
      >
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">60 minutes</option>
        <option value="90">90 minutes</option>
        <option value="120">120 minutes</option>
      </TimeSelect>

      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>

      <Controls>
        <Button onClick={handleStart} disabled={isRunning}>
          Start
        </Button>
        <Button onClick={handlePause} disabled={!isRunning}>
          Pause
        </Button>
        <Button onClick={handleStop} disabled={!isRunning && timeLeft === selectedTime * 60}>
          Stop
        </Button>
      </Controls>

      {showSaveModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Save Session</ModalTitle>
            <p>Activity: {activityType}</p>
            <p>Duration: {formatTime((selectedTime * 60) - timeLeft)}</p>
            <ModalActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </TimerContainer>
  );
};

export default Timer; 