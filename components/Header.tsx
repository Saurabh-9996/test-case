
import React from 'react';
import { ViewMode } from '../types';
import { Hospital, LogOut, UserCircle } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onLogout }) => {
  if (viewMode === 'LOGIN') return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Hospital size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">
              OT Command Center
            </h1>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
              {viewMode === 'STAFF' ? 'Staff Management' : 'Live Status Board'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Session</span>
             <span className="text-xs font-bold text-slate-700">{viewMode === 'STAFF' ? 'Medical Staff' : 'Display System'}</span>
          </div>
          <button 
            onClick={onLogout}
            className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-200 hover:border-red-100"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};
