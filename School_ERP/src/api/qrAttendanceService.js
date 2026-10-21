import { attendanceService } from './attendanceService';

const PUNCHES_KEY = 'school_erp_qr_punches_v1';
const SETTINGS_KEY = 'school_erp_qr_settings_v1';
const AUDIT_KEY = 'school_erp_qr_audit_v1';

// Preset Student and Staff database with barcodes/QR data
export const CANDIDATES_DATABASE = [
  {
    id: 'STU-1001',
    code: 'STU-1001',
    barcode: '9845001001',
    name: 'Aarav Sharma',
    type: 'Student',
    classDesig: 'Class 10 - A',
    rollNo: '1001',
    guardian: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B+',
    status: 'Active'
  },
  {
    id: 'STU-1002',
    code: 'STU-1002',
    barcode: '9845001002',
    name: 'Diya Patel',
    type: 'Student',
    classDesig: 'Class 10 - A',
    rollNo: '1002',
    guardian: 'Kiran Patel',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
    status: 'Active'
  },
  {
    id: 'STU-1003',
    code: 'STU-1003',
    barcode: '9845001003',
    name: 'Kabir Mehta',
    type: 'Student',
    classDesig: 'Class 12 - Science',
    rollNo: '1205',
    guardian: 'Sanjay Mehta',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'A+',
    status: 'Active'
  },
  {
    id: 'STU-1004',
    code: 'STU-1004',
    barcode: '9845001004',
    name: 'Ananya Verma',
    type: 'Student',
    classDesig: 'Class 9 - B',
    rollNo: '908',
    guardian: 'Sunil Verma',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'AB+',
    status: 'Active'
  },
  {
    id: 'STU-1005',
    code: 'STU-1005',
    barcode: '9845001005',
    name: 'Rohan Singhania',
    type: 'Student',
    classDesig: 'Class 11 - Commerce',
    rollNo: '1114',
    guardian: 'Vikram Singhania',
    phone: '+91 98765 43214',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B-',
    status: 'Active'
  },
  {
    id: 'STF-2001',
    code: 'STF-2001',
    barcode: '9845002001',
    name: 'Dr. Ramesh Kumar',
    type: 'Staff',
    classDesig: 'Senior Mathematics HOD',
    rollNo: 'EMP-2001',
    guardian: 'Faculty',
    phone: '+91 98765 43215',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
    status: 'Active'
  },
  {
    id: 'STF-2002',
    code: 'STF-2002',
    barcode: '9845002002',
    name: 'Mrs. Sunita Sen',
    type: 'Staff',
    classDesig: 'PGT English Literature',
    rollNo: 'EMP-2002',
    guardian: 'Faculty',
    phone: '+91 98765 43216',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'A+',
    status: 'Active'
  }
];

// Default Settings
export const DEFAULT_QR_SETTINGS = {
  autoAttendance: true,
  soundBeep: true,
  cooldownSeconds: 3,
  location: 'Main Gate Terminal',
  deviceType: 'camera', // 'camera' or 'sensor'
  defaultMode: 'auto', // 'auto', 'in-only', 'out-only'
  formats: { qr: true, barcode: true },
  flashEffect: true
};

// Web Audio API beep sound generator
export const playScanAudio = (type = 'success') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'success') {
      // High pitch crisp POS beep (1800Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'duplicate') {
      // Double low tone warning beep (600Hz -> 450Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(450, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (err) {
    // Audio context may require initial user gesture
  }
};

export const qrAttendanceService = {
  // Load settings
  getSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_QR_SETTINGS, ...JSON.parse(raw) } : DEFAULT_QR_SETTINGS;
    } catch {
      return DEFAULT_QR_SETTINGS;
    }
  },

  // Save settings
  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  // Load recorded punches today
  getPunches() {
    try {
      const raw = localStorage.getItem(PUNCHES_KEY);
      if (!raw) {
        // Seed initial morning demo check-ins
        const initial = [
          {
            id: 'punch-1',
            candidateId: 'STU-1001',
            name: 'Aarav Sharma',
            type: 'Student',
            classDesig: 'Class 10 - A',
            rollNo: '1001',
            direction: 'IN',
            timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
            timeFormatted: '07:45:12 AM',
            location: 'Main Gate Terminal',
            device: 'Camera Station #1',
            avatar: CANDIDATES_DATABASE[0].avatar
          },
          {
            id: 'punch-2',
            candidateId: 'STF-2001',
            name: 'Dr. Ramesh Kumar',
            type: 'Staff',
            classDesig: 'Senior Mathematics HOD',
            rollNo: 'EMP-2001',
            direction: 'IN',
            timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
            timeFormatted: '07:52:04 AM',
            location: 'Main Gate Terminal',
            device: 'Camera Station #1',
            avatar: CANDIDATES_DATABASE[5].avatar
          }
        ];
        localStorage.setItem(PUNCHES_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  // Load scan audit logs
  getAuditLogs() {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      if (!raw) {
        const initialAudit = [
          {
            id: 'audit-1',
            time: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
            outcome: 'Accepted',
            resultReason: 'Marked IN Successfully',
            targetName: 'Aarav Sharma',
            targetType: 'Student',
            device: 'Camera Station #1',
            location: 'Main Gate Terminal',
            mode: 'QR'
          },
          {
            id: 'audit-2',
            time: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
            outcome: 'Accepted',
            resultReason: 'Marked IN Successfully',
            targetName: 'Dr. Ramesh Kumar',
            targetType: 'Staff',
            device: 'Camera Station #1',
            location: 'Main Gate Terminal',
            mode: 'QR'
          }
        ];
        localStorage.setItem(AUDIT_KEY, JSON.stringify(initialAudit));
        return initialAudit;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  // Process a live scan by code or barcode
  async processScan(rawCode, manualDirection = null) {
    const cleaned = String(rawCode || '').trim();
    if (!cleaned) return { success: false, reason: 'Empty scan code' };

    // Find candidate in database
    const candidate = CANDIDATES_DATABASE.find(c => 
      c.code.toLowerCase() === cleaned.toLowerCase() ||
      c.barcode.toLowerCase() === cleaned.toLowerCase() ||
      c.rollNo.toLowerCase() === cleaned.toLowerCase() ||
      c.name.toLowerCase() === cleaned.toLowerCase()
    );

    const settings = this.getSettings();
    const punches = this.getPunches();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (!candidate) {
      if (settings.soundBeep) playScanAudio('duplicate');

      // Log unrecognized audit
      const auditLog = {
        id: 'audit-' + Date.now(),
        time: now.toISOString(),
        outcome: 'Blocked',
        resultReason: `Unrecognized Card / Barcode: ${cleaned}`,
        targetName: `Unknown [${cleaned}]`,
        targetType: 'Student',
        device: settings.deviceType === 'camera' ? 'Camera Kiosk' : 'Barcode Gun',
        location: settings.location,
        mode: cleaned.startsWith('9845') ? 'Barcode' : 'QR'
      };
      const audits = [auditLog, ...this.getAuditLogs()];
      localStorage.setItem(AUDIT_KEY, JSON.stringify(audits));

      return {
        success: false,
        status: 'unrecognized',
        code: cleaned,
        reason: 'ID Card / Barcode not recognized in School ERP directory'
      };
    }

    // Check recent punch for cooldown
    const lastPunch = punches.find(p => p.candidateId === candidate.id);
    if (lastPunch) {
      const elapsedSeconds = (now.getTime() - new Date(lastPunch.timestamp).getTime()) / 1000;
      if (elapsedSeconds < (settings.cooldownSeconds || 3)) {
        if (settings.soundBeep) playScanAudio('duplicate');
        return {
          success: false,
          status: 'cooldown',
          candidate,
          reason: `Cooldown active: ${candidate.name} punched ${Math.round(elapsedSeconds)}s ago. Please wait.`
        };
      }
    }

    // Determine IN or OUT direction
    let direction = 'IN';
    if (manualDirection) {
      direction = manualDirection;
    } else if (settings.defaultMode === 'in-only') {
      direction = 'IN';
    } else if (settings.defaultMode === 'out-only') {
      direction = 'OUT';
    } else {
      // Auto toggle: if last punch was IN, next punch is OUT
      if (lastPunch && lastPunch.direction === 'IN') {
        direction = 'OUT';
      } else {
        direction = 'IN';
      }
    }

    // Success sound
    if (settings.soundBeep) playScanAudio('success');

    // Create new punch record
    const punchRecord = {
      id: 'punch-' + Date.now(),
      candidateId: candidate.id,
      name: candidate.name,
      type: candidate.type,
      classDesig: candidate.classDesig,
      rollNo: candidate.rollNo,
      direction,
      timestamp: now.toISOString(),
      timeFormatted,
      location: settings.location,
      device: settings.deviceType === 'camera' ? 'Camera Station #1' : 'Barcode Gun',
      avatar: candidate.avatar
    };

    const updatedPunches = [punchRecord, ...punches];
    localStorage.setItem(PUNCHES_KEY, JSON.stringify(updatedPunches));

    // Audit log
    const auditRecord = {
      id: 'audit-' + Date.now(),
      time: now.toISOString(),
      outcome: 'Accepted',
      resultReason: `Marked ${direction} Successfully (${candidate.classDesig})`,
      targetName: candidate.name,
      targetType: candidate.type,
      device: settings.deviceType === 'camera' ? 'Camera Station #1' : 'Barcode Gun',
      location: settings.location,
      mode: cleaned.startsWith('9845') ? 'Barcode' : 'QR'
    };
    const updatedAudits = [auditRecord, ...this.getAuditLogs()];
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updatedAudits));

    // Async backend notify (non-blocking)
    try {
      attendanceService.recordQRScan({
        code: candidate.code,
        targetName: candidate.name,
        targetType: candidate.type,
        classDesig: candidate.classDesig,
        location: settings.location,
        device: punchRecord.device,
        mode: auditRecord.mode,
        direction
      }).catch(() => {});
    } catch {}

    return {
      success: true,
      status: 'success',
      direction,
      candidate,
      punch: punchRecord
    };
  }
};

export default qrAttendanceService;
