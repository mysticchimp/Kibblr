import React, { useState } from 'react';
import styled from 'styled-components';
import { TimeTrackingProvider } from './context/TimeTrackingContext';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const Nav = styled.nav`
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavItem = styled.li<{ active: boolean }>`
  margin-right: 1rem;
  
  button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: ${props => props.active ? '#007bff' : '#666'};
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    font-size: 1rem;
    
    &:hover {
      color: #007bff;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'dashboard'>('timer');

  return (
    <TimeTrackingProvider>
      <AppContainer>
        <Nav>
          <NavList>
            <NavItem active={activeTab === 'timer'}>
              <button onClick={() => setActiveTab('timer')}>Timer</button>
            </NavItem>
            <NavItem active={activeTab === 'dashboard'}>
              <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
            </NavItem>
          </NavList>
        </Nav>
        
        <MainContent>
          {activeTab === 'timer' ? <Timer /> : <Dashboard />}
        </MainContent>
      </AppContainer>
    </TimeTrackingProvider>
  );
};

export default App;
