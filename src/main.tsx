import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './components/Landing';
import { TeacherPage } from './pages/TeacherPage';
import { StudentPage } from './pages/StudentPage';
import './index.css';

// Check environment variable for mode locking
const appModeConfig = import.meta.env.VITE_APP_MODE || 'dual'; // 'dual', 'teacher', or 'student'

function App() {
  // If mode is locked, redirect to appropriate page
  if (appModeConfig === 'teacher') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<TeacherPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (appModeConfig === 'student') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<StudentPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Dual mode - show landing and allow navigation
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/teacher/*" element={<TeacherPage />} />
        <Route path="/student/*" element={<StudentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
