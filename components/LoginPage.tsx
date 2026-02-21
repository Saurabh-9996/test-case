
import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Hospital, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'STAFF' | 'DISPLAY') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Credentials logic
    if (userId === 'staff' && password === 'staff2026') {
      onLogin('STAFF');
    } else if (userId === 'display' && password === 'display123') {
      onLogin('DISPLAY');
    } else {
      setError('Invalid ID or Password. Please contact IT.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all">
        <div className="bg-blue-600 p-10 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-md">
            <Hospital size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Hospital Dashboard</h2>
          <p className="text-blue-100 font-medium mt-2 opacity-80 uppercase text-xs tracking-widest">Secure Access Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">User Identification</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Access Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Authenticate <ArrowRight size={16} />
          </button>

          <div className="pt-4 text-center">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">
              Hospital Admin Support: <span className="text-blue-600">ext 404</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
