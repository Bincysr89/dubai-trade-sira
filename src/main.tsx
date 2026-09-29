import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import CustomerTypePage from './pages/CustomerTypePage';
import OtherAgentTypePage from './pages/OtherAgentTypePage';
import LandingPage from './pages/LandingPage';
import { RequireAuth } from './auth';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customer-type" element={<RequireAuth><CustomerTypePage /></RequireAuth>} />
        <Route path="/other-agent-type" element={<RequireAuth><OtherAgentTypePage /></RequireAuth>} />
        <Route path="/landing/:agent" element={<RequireAuth><LandingPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
