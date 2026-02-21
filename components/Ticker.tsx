
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { getSmartHospitalTip } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

export const Ticker: React.FC = () => {
  const [updates, setUpdates] = useState<string[]>([]);
  const [aiTip, setAiTip] = useState<string>('Loading helpful health tips...');

  useEffect(() => {
    const loadUpdates = () => {
      const recent = dbService.getRecentUpdates();
      const strings = recent.map(r => 
        `[${r.uhid}] ${r.name} updated to ${r.status}`
      );
      setUpdates(strings);
    };

    const loadTip = async () => {
      const tip = await getSmartHospitalTip();
      setAiTip(tip);
    };

    loadUpdates();
    loadTip();

    const interval = setInterval(loadUpdates, 5000);
    const tipInterval = setInterval(loadTip, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-blue-100 py-3 overflow-hidden z-50 shadow-2xl border-t border-blue-800">
      <div className="animate-ticker text-xl font-bold flex items-center gap-8">
        {updates.map((u, i) => (
          <span key={i}>{u}</span>
        ))}
        <span className="flex items-center gap-2 text-amber-400">
          <Sparkles size={20} /> SMART TIP: {aiTip}
        </span>
        <span>Stay hydrated and reach out to the help desk if you need assistance.</span>
        
        {/* Duplicate for seamless loop */}
        {updates.map((u, i) => (
          <span key={`dup-${i}`}>{u}</span>
        ))}
        <span className="flex items-center gap-2 text-amber-400">
          <Sparkles size={20} /> SMART TIP: {aiTip}
        </span>
        <span>Stay hydrated and reach out to the help desk if you need assistance.</span>
      </div>
    </div>
  );
};
