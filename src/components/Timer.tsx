import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTimeTracking } from '../context/TimeTrackingContext';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const TimerDisplay = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin: 2rem 0;
  font-family: monospace;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #007bff;
  color: white;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Timer: React.FC = () => {
  const { addRecord } = useTimeTracking();
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activityType, setActivityType] = useState<string>('MBA');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // Default 60 minutes

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveSession = (): void => {
    console.log('Saving session...');
    const duration = selectedDuration * 60 - timeLeft;
    console.log('Duration:', duration);
    console.log('Activity Type:', activityType);
    
    try {
      addRecord({
        activityType,
        duration,
        endTime: new Date().toISOString()
      });
      console.log('Record added successfully');
    } catch (error) {
      console.error('Error adding record:', error);
    }
    
    setTimeLeft(selectedDuration * 60);
    setShowSaveModal(false);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const duration = parseInt(e.target.value);
    setSelectedDuration(duration);
    setTimeLeft(duration * 60);
    setIsRunning(false);
  };

  return (
    <TimerContainer>
      <Select
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
      >
        <option value="MBA">MBA</option>
        <option value="Business Idea">Business Idea</option>
        <option value="Gym">Gym</option>
        <option value="Cooking">Cooking</option>
        <option value="Job Search">Job Search</option>
      </Select>

      <Select
        value={selectedDuration}
        onChange={handleDurationChange}
      >
        <option value={15}>15 minutes</option>
        <option value={30}>30 minutes</option>
        <option value={45}>45 minutes</option>
        <option value={60}>60 minutes</option>
        <option value={75}>75 minutes</option>
        <option value={90}>90 minutes</option>
        <option value={105}>105 minutes</option>
        <option value={120}>120 minutes</option>
      </Select>

      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>

      <Controls>
        <Button onClick={() => setIsRunning(!isRunning)}>
          <IconWrapper>
            {isRunning ? (
              <PauseIcon sx={{ fontSize: 20, color: '#fff' }} />
            ) : (
              <PlayArrowIcon sx={{ fontSize: 20, color: '#fff' }} />
            )}
            {isRunning ? 'Pause' : 'Start'}
          </IconWrapper>
        </Button>
        <Button onClick={handleReset}>
          <IconWrapper>
            <RestartAltIcon sx={{ fontSize: 20, color: '#fff' }} />
            Reset
          </IconWrapper>
        </Button>
        <Button
          onClick={() => {
            setIsRunning(false);
            setShowSaveModal(true);
          }}
        >
          <IconWrapper>
            <StopIcon sx={{ fontSize: 20, color: '#fff' }} />
            Stop
          </IconWrapper>
        </Button>
      </Controls>

      {showSaveModal && (
        <Modal>
          <h3>Save this session?</h3>
          <ModalButtons>
            <Button onClick={handleSaveSession}>Yes</Button>
            <Button onClick={() => setShowSaveModal(false)}>No</Button>
          </ModalButtons>
        </Modal>
      )}
    </TimerContainer>
  );
};

export default Timer; 