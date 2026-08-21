import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <div className="min-h-screen flex flex-col bg-gov-bg text-gov-navy selection:bg-amber-100 selection:text-amber-900 pb-16 md:pb-0">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/assistant" element={<ConversationPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/officer" element={<OfficerPage />} />
            </Routes>
          </main>
          <MobileBottomNav />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
