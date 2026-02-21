
import { PatientRecord, OTStatus } from '../types';

const STORAGE_KEY = 'ot_status_records';

export const dbService = {
  getRecords: (): PatientRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  updateRecord: (uhid: string, name: string, status: OTStatus): PatientRecord[] => {
    const records = dbService.getRecords();
    const existingIndex = records.findIndex(r => r.uhid === uhid);
    
    const now = Date.now();
    if (existingIndex > -1) {
      records[existingIndex] = { ...records[existingIndex], name, status, lastUpdated: now };
    } else {
      records.push({ uhid, name, status, lastUpdated: now });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return records;
  },

  deleteRecord: (uhid: string): PatientRecord[] => {
    const records = dbService.getRecords().filter(r => r.uhid !== uhid);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return records;
  },

  getRecentUpdates: (limit: number = 5): PatientRecord[] => {
    return dbService.getRecords()
      .sort((a, b) => b.lastUpdated - a.lastUpdated)
      .slice(0, limit);
  }
};
