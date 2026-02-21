
import React, { useState, useEffect } from 'react';
import { OTStatus, PatientRecord } from '../types';
import { dbService } from '../services/dbService';
import { UserPen, CircleCheck, CircleAlert, Save, List, SquarePen, Trash2, FolderOpen } from 'lucide-react';

export const StaffUpdateForm: React.FC = () => {
  const [uhid, setUhid] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<OTStatus>(OTStatus.WAITING);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setRecords(dbService.getRecords());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uhid || !name) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }

    const updated = dbService.updateRecord(uhid, name, status);
    setRecords([...updated]); 
    setMessage({ text: `Update successful for: ${name}`, type: 'success' });
    
    setUhid('');
    setName('');
    setStatus(OTStatus.WAITING);
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = (record: PatientRecord) => {
    setUhid(record.uhid);
    setName(record.name);
    setStatus(record.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (uhid: string) => {
    // Immediate deletion logic as requested
    const updated = dbService.deleteRecord(uhid);
    setRecords([...updated]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-tight">
          <UserPen className="text-blue-600" /> Patient Status Update
        </h2>
        
        {message && (
          <div className={`mb-8 p-5 rounded-2xl flex items-center gap-4 transition-all border ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {message.type === 'success' ? <CircleCheck className="text-xl" /> : <CircleAlert className="text-xl" />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">UHID (Medical ID)</label>
            <input
              type="text"
              value={uhid}
              onChange={(e) => setUhid(e.target.value.toUpperCase())}
              placeholder="E.G. 1234"
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-mono font-bold"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Full Patient Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-bold"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Current OT Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OTStatus)}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg appearance-none cursor-pointer font-bold"
            >
              {Object.values(OTStatus).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <Save /> Commit Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-xl uppercase tracking-tight">Active Operation List</h3>
          <span className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-blue-200">
            {records.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-10 py-5 text-left">UHID</th>
                <th className="px-10 py-5 text-left">Patient</th>
                <th className="px-10 py-5 text-left">Current Status</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center text-slate-400">
                    <FolderOpen size={64} className="mb-4 mx-auto opacity-20" />
                    <span className="font-black uppercase tracking-widest text-xs">No entries found</span>
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={`${r.uhid}-${r.lastUpdated}`} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-10 py-6 font-mono font-black text-slate-500">{r.uhid}</td>
                    <td className="px-10 py-6 font-black text-slate-800 text-lg">{r.name}</td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="text-blue-500 hover:text-blue-700 p-3 rounded-xl hover:bg-blue-50 transition-all"
                      >
                        <SquarePen size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(r.uhid)}
                        className="text-red-400 hover:text-red-600 p-3 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
