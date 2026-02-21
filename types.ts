
export enum OTStatus {
  WAITING = 'Pre-Op / Waiting',
  SHIFTED_TO_OT = 'Shifted to OT',
  ANESTHESIA = 'Anesthesia Induction',
  ONGOING = 'Surgery Ongoing',
  RECOVERY = 'Recovery / Post-Op',
  SHIFTED_TO_WARD = 'Shifted to Ward / ICU',
  CANCELLED = 'Cancelled / Deferred'
}

export interface PatientRecord {
  uhid: string;
  name: string;
  status: OTStatus;
  lastUpdated: number;
}

export type ViewMode = 'LOGIN' | 'STAFF' | 'DISPLAY';

export interface UserSession {
  role: 'STAFF' | 'DISPLAY';
  id: string;
}
