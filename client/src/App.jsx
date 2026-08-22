import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { ConversationPage } from './pages/ConversationPage';
import { TrackingPage } from './pages/TrackingPage';
import { OfficerPage } from './pages/OfficerPage';

export function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-stitch-bg text-stitch-navy selection:bg-amber-100 selection:text-amber-900 pb-20 md:pb-4 overflow-x-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/assistant" element={<ConversationPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/officer" element={<OfficerPage />} />
              {/* Legacy / Alias Route Redirects */}
              <Route path="/schemes" element={<Navigate to="/assistant" replace />} />
              <Route path="/grievances" element={<Navigate to="/assistant" replace />} />
              {/* 404 Wildcard Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <MobileBottomNav />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
