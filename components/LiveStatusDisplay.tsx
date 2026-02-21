
import React, { useState, useEffect } from 'react';
import { OTStatus, PatientRecord } from '../types';
import { dbService } from '../services/dbService';
import { Monitor, ClipboardCheck } from 'lucide-react';

const getStatusBadgeClass = (status: OTStatus) => {
  switch (status) {
    case OTStatus.ONGOING:
      return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
    case OTStatus.RECOVERY:
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case OTStatus.SHIFTED_TO_WARD:
      return 'bg-green-50 text-green-700 border-green-200';
    case OTStatus.ANESTHESIA:
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case OTStatus.SHIFTED_TO_OT:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case OTStatus.CANCELLED:
      return 'bg-slate-100 text-slate-500 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

const PatientRow: React.FC<{ r: PatientRecord }> = ({ r }) => (
  <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 mb-6 flex items-center shadow-sm transition-all hover:shadow-md">
    <div className="w-1/4">
      <span className="text-4xl font-mono font-black text-slate-700 tracking-tighter">
        {r.uhid}
      </span>
    </div>
    <div className="w-1/2">
      <span className="text-4xl font-bold text-slate-800">
        {r.name}
      </span>
    </div>
    <div className="w-1/4 flex justify-end">
      <span className={`px-8 py-4 rounded-full text-2xl font-black border-2 ${getStatusBadgeClass(r.status)}`}>
        {r.status}
      </span>
    </div>
  </div>
);

export const LiveStatusDisplay: React.FC = () => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = () => {
      const data = dbService.getRecords();
      setRecords(data);
      setRefreshCounter(10);
    };

    fetchData();
    const interval = setInterval(() => {
      setRefreshCounter(prev => {
        if (prev <= 1) {
          fetchData();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  // For a seamless infinite loop from bottom to top:
  // We repeat the records enough times to ensure the animation is smooth and covers the screen.
  let displayRecords: PatientRecord[] = [];
  if (records.length > 0) {
    // If list is small, triplicate it to ensure it fills the scroll height
    const repeats = records.length < 5 ? 4 : 2;
    for (let i = 0; i < repeats; i++) {
      displayRecords = [...displayRecords, ...records];
    }
  }
  
  // Animation duration: approx 4-6 seconds per record to ensure it's readable
  const animationDuration = Math.max(20, records.length * 5);

  return (
    <div className="fixed inset-0 top-16 bg-slate-50 text-slate-900 flex flex-col overflow-hidden">
      {/* Header Info Bar */}
      <div className="z-30 bg-white border-b border-slate-200 px-12 py-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Monitor className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Live Surgery Status Board</h2>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-[0.3em] mt-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Real-time Hospital Feed
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
             <span className="text-5xl font-mono font-black text-slate-800">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
             </span>
             <span className="text-slate-400 text-sm font-bold uppercase tracking-[0.4em] mt-1">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
             </span>
          </div>

          <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 px-6 py-3 rounded-full">
            <span className="text-blue-400 font-black text-xs uppercase tracking-widest">Auto Update</span>
            <span className="text-2xl font-black text-blue-600 w-10 text-center">
              {refreshCounter}s
            </span>
          </div>
        </div>
      </div>

      {/* Floating Scroller Area */}
      <div className="flex-1 relative scrolling-mask px-12 pt-12 pb-20">
        {/* Table Headings - Sticky for context */}
        <div className="flex px-10 mb-8 text-slate-400 font-black text-sm uppercase tracking-[0.5em] sticky top-0 z-20">
          <div className="w-1/4">UHID</div>
          <div className="w-1/2">Patient Name</div>
          <div className="w-1/4 text-right">Current Status</div>
        </div>

        {records.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale scale-110">
            <ClipboardCheck size={160} className="mb-10 text-blue-200" />
            <h3 className="text-6xl font-black uppercase tracking-widest text-slate-300">No Active Procedures</h3>
          </div>
        ) : (
          <div 
            className="flex flex-col animate-float-up"
            style={{ animationDuration: `${animationDuration}s` }}
          >
            {displayRecords.map((r, idx) => (
              <PatientRow key={`${r.uhid}-${r.lastUpdated}-${idx}`} r={r} />
            ))}
          </div>
        )}
      </div>

      {/* Aesthetic Legend Footer */}
      <div className="bg-white border-t border-slate-100 px-12 py-5 flex gap-10 justify-center items-center z-40">
         <span className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Status Legend</span>
         <div className="flex gap-8">
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-200"></div><span className="text-xs font-bold text-slate-500 uppercase">Ongoing</span></div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></div><span className="text-xs font-bold text-slate-500 uppercase">Recovery</span></div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></div><span className="text-xs font-bold text-slate-500 uppercase">Shifted Ward</span></div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div><span className="text-xs font-bold text-slate-500 uppercase">Shifted OT</span></div>
         </div>
      </div>
    </div>
  );
};
