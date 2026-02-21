
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { StaffUpdateForm } from './components/StaffUpdateForm';
import { LiveStatusDisplay } from './components/LiveStatusDisplay';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2 } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOGIN');

  // Simple persistence check for the session
  useEffect(() => {
    const savedRole = sessionStorage.getItem('hospital_role');
    if (savedRole === 'STAFF') setViewMode('STAFF');
    if (savedRole === 'DISPLAY') setViewMode('DISPLAY');
  }, []);

  const handleLogin = (role: 'STAFF' | 'DISPLAY') => {
    sessionStorage.setItem('hospital_role', role);
    setViewMode(role);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hospital_role');
    setViewMode('LOGIN');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header viewMode={viewMode} onLogout={handleLogout} />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {viewMode === 'LOGIN' && (
              <LoginPage onLogin={handleLogin} />
            )}
            
            {viewMode === 'STAFF' && (
              <StaffUpdateForm />
            )}
            
            {viewMode === 'DISPLAY' && (
              <LiveStatusDisplay />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fullscreen Button (Only for Display Mode) */}
      {viewMode === 'DISPLAY' && (
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }}
          className="fixed bottom-24 right-12 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-[60]"
          title="Toggle Fullscreen"
        >
          {document.fullscreenElement ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      )}
    </div>
  );
};

export default App;
