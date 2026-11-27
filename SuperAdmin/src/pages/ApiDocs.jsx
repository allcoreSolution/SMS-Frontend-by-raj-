import React, { useState, useMemo } from 'react';
import { 
  Plug, ChevronDown, ChevronRight, Search, Download, Lock, Globe, 
  ShieldCheck, Info, Copy, Check, Terminal, ExternalLink, Sparkles, Filter 
} from 'lucide-react';
import Swal from 'sweetalert2';

// Dynamic API Base URL resolution
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5050/api';
    }
  }
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'https://sms-backend-by-raj-s7dt.onrender.com/api';
};

// ── Complete Platform API Endpoints Registry ────────────────────────────────
const ALL_ENDPOINTS = [
  // SuperAdmin Governance & Enterprise
  { 
    group: 'SuperAdmin Core', subgroup: 'GOVERNANCE', method: 'POST', path: '/superadmin/impersonate/:schoolId', 
    desc: '1-Click School Portal Impersonation (issues admin JWT bridge)', access: 'Token',
    params: '{ "schoolId": "SCH-1001" }',
    sampleResponse: '{ "success": true, "token": "jwt_impersonation_token_xxx", "redirectUrl": "/dashboard" }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'GOVERNANCE', method: 'GET', path: '/superadmin/telemetry', 
    desc: 'Real-time Node.js execution runtime, heap memory & MongoDB latency', access: 'Token',
    sampleResponse: '{ "success": true, "telemetry": { "status": "ONLINE", "process": { "uptime": "14h 22m", "memory": { "heapUsed": "48 MB" } } } }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'GOVERNANCE', method: 'GET', path: '/superadmin/audit-logs', 
    desc: 'Tamper-proof immutable ledger of all super administrative actions', access: 'Token',
    sampleResponse: '{ "success": true, "data": [{ "action": "IMPERSONATE_SCHOOL", "actor": "Super Admin", "status": "SUCCESS" }] }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'BROADCAST', method: 'GET', path: '/superadmin/broadcast-announcements', 
    desc: 'Fetch global platform notices and broadcast announcements', access: 'Token',
    sampleResponse: '{ "success": true, "count": 3, "data": [{ "title": "System Maintenance", "priority": "High" }] }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'BROADCAST', method: 'POST', path: '/superadmin/broadcast-announcements', 
    desc: 'Publish global notice across all tenant dashboards', access: 'Token',
    params: '{ "title": "Database Patch", "message": "Cluster upgrade tonight", "priority": "High", "targetAudience": "all" }',
    sampleResponse: '{ "success": true, "message": "Broadcast published" }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'GET', path: '/tenant/list', 
    desc: 'Fetch all registered schools and tenant subscription profiles', access: 'Token',
    sampleResponse: '{ "success": true, "schools": [{ "schoolName": "Greenwood High", "status": "Active" }] }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'POST', path: '/tenant/register', 
    desc: 'Register a newly onboarded school tenant', access: 'Token',
    params: '{ "schoolName": "DPS Delhi", "adminEmail": "admin@dps.edu", "plan": "growth" }',
    sampleResponse: '{ "success": true, "message": "Tenant created successfully" }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'GET', path: '/tenant/check-expiries', 
    desc: 'Automated WhatsApp & Email subscription expiry scanner', access: 'Token',
    sampleResponse: '{ "success": true, "scanned": 12, "expiringSoon": 2, "notified": 2 }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'TENANT', method: '/tenant/export-data/:tenantId', 
    method: 'GET', path: '/tenant/export-data/:tenantId', 
    desc: '1-Click full school data export dump (JSON format)', access: 'Token',
    sampleResponse: '{ "school": { "name": "DPS" }, "studentsCount": 420, "staffCount": 24 }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'TENANT', method: 'PUT', path: '/tenant/:id/suspend', 
    desc: 'Suspend tenant access with customizable grace period', access: 'Token',
    sampleResponse: '{ "success": true, "message": "Tenant suspended with grace" }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'BILLING', method: 'GET', path: '/plans/list', 
    desc: 'List all SaaS subscription plans and feature quotas', access: 'Token',
    sampleResponse: '{ "success": true, "data": [{ "name": "Growth Plan", "priceMonthly": 1000 }] }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'BILLING', method: 'POST', path: '/superadmin/generate-tax-invoice', 
    desc: 'Generate B2B GST-compliant tax invoice PDF', access: 'Token',
    params: '{ "schoolId": "SCH-1", "amount": 10000, "gstNumber": "07AAAAA0000A1Z5" }',
    sampleResponse: '{ "success": true, "invoiceNumber": "INV-2026-004", "taxAmount": 1800 }'
  },
  { 
    group: 'SuperAdmin Core', subgroup: 'COMMS', method: 'PUT', path: '/tenant/wallet/recharge', 
    desc: 'Recharge school SMS and WhatsApp communication credits', access: 'Token',
    params: '{ "schoolId": "SCH-1", "amount": 1500, "channel": "whatsapp" }',
    sampleResponse: '{ "success": true, "newBalance": 2400 }'
  },

  // Auth & Core Endpoints
  { 
    group: 'Auth & Core', subgroup: 'AUTH', method: 'POST', path: '/v1/login', 
    desc: 'Authenticate user and return JWT bearer token', access: 'Public',
    params: '{ "email": "user@school.com", "password": "secure_password" }',
    sampleResponse: '{ "success": true, "token": "jwt_token_string", "user": { "role": "admin" } }'
  },
  { 
    group: 'Auth & Core', subgroup: 'AUTH', method: 'GET', path: '/v1/me', 
    desc: 'Get currently authenticated user identity and permissions', access: 'Token',
    sampleResponse: '{ "success": true, "user": { "id": "USR-1", "email": "admin@school.com" } }'
  },
  { 
    group: 'Auth & Core', subgroup: 'AUTH', method: 'POST', path: '/v1/change-password', 
    desc: 'Update password with current password verification', access: 'Token',
    params: '{ "oldPassword": "old", "newPassword": "new" }',
    sampleResponse: '{ "success": true, "message": "Password changed successfully" }'
  },
  { 
    group: 'Auth & Core', subgroup: 'OTP', method: 'POST', path: '/v1/otp/send', 
    desc: 'Send OTP verification code to mobile number or email', access: 'Public',
    params: '{ "mobile": "+919876543210", "type": "LOGIN" }',
    sampleResponse: '{ "success": true, "message": "OTP dispatched via SMS" }'
  },
  { 
    group: 'Auth & Core', subgroup: 'OTP', method: 'POST', path: '/v1/otp/verify', 
    desc: 'Verify OTP code and authenticate session', access: 'Public',
    params: '{ "mobile": "+919876543210", "otp": "4521" }',
    sampleResponse: '{ "success": true, "verified": true }'
  },
  { 
    group: 'Auth & Core', subgroup: 'FACE', method: 'POST', path: '/v1/face/enroll', 
    desc: 'Enroll 128-dimensional biometric face vector', access: 'Token',
    params: '{ "studentId": "STD-101", "vector": [0.12, -0.45, 0.88] }',
    sampleResponse: '{ "success": true, "enrolled": true }'
  },
  { 
    group: 'Auth & Core', subgroup: 'FACE', method: 'POST', path: '/v1/face/match', 
    desc: 'Match biometric face vector against enrolled embeddings', access: 'Token',
    params: '{ "vector": [0.12, -0.44, 0.87] }',
    sampleResponse: '{ "match": true, "studentId": "STD-101", "confidence": 0.98 }'
  },

  // Parent App Endpoints
  { 
    group: 'Parent App', subgroup: 'DASHBOARD', method: 'GET', path: '/v1/parent/dashboard', 
    desc: 'Parent dashboard summary including fees, attendance and notices', access: 'Token',
    sampleResponse: '{ "childrenCount": 2, "pendingFees": 4500, "attendanceToday": "Present" }'
  },
  { 
    group: 'Parent App', subgroup: 'STUDENTS', method: 'GET', path: '/v1/parent/children', 
    desc: 'List all enrolled children linked to parent account', access: 'Token',
    sampleResponse: '{ "children": [{ "id": "STD-1", "name": "Aarav Sharma", "class": "10-A" }] }'
  },
  { 
    group: 'Parent App', subgroup: 'FEES', method: 'GET', path: '/v1/parent/fees', 
    desc: 'Outstanding fee breakdown and historical payment receipts', access: 'Token',
    sampleResponse: '{ "invoices": [{ "title": "Q3 Tuition Fee", "amount": 6500, "status": "Due" }] }'
  },
  { 
    group: 'Parent App', subgroup: 'FEES', method: 'POST', path: '/v1/parent/fees/pay', 
    desc: 'Initiate online payment order via Razorpay/PhonePe', access: 'Token',
    params: '{ "invoiceId": "INV-102", "amount": 6500 }',
    sampleResponse: '{ "orderId": "order_rcptid_11", "key": "rzp_live_xxx", "amount": 650000 }'
  },
  { 
    group: 'Parent App', subgroup: 'ATTENDANCE', method: 'GET', path: '/v1/parent/attendance', 
    desc: 'Detailed monthly attendance log and leave balance of child', access: 'Token',
    sampleResponse: '{ "percentage": 94.5, "presentDays": 22, "absentDays": 1 }'
  },

  // Staff & Teacher App Endpoints
  { 
    group: 'Staff App', subgroup: 'PROFILE', method: 'GET', path: '/v1/staff/profile', 
    desc: 'Faculty profile details, assigned timetable and department', access: 'Token',
    sampleResponse: '{ "name": "Dr. Sunita Rao", "designation": "HOD Mathematics" }'
  },
  { 
    group: 'Staff App', subgroup: 'ATTENDANCE', method: 'POST', path: '/v1/staff/attendance', 
    desc: 'Mark daily student classroom attendance or staff punch-in', access: 'Token',
    params: '{ "classId": "CLS-10A", "attendance": [{ "studentId": "STD-1", "status": "P" }] }',
    sampleResponse: '{ "success": true, "recordedCount": 42 }'
  },
  { 
    group: 'Staff App', subgroup: 'LEAVE', method: 'POST', path: '/v1/staff/leave', 
    desc: 'Submit employee leave request for principal approval', access: 'Token',
    params: '{ "leaveType": "Casual", "startDate": "2026-12-01", "days": 2 }',
    sampleResponse: '{ "success": true, "status": "Pending Principal Approval" }'
  },

  // Transport & Driver App Endpoints
  { 
    group: 'Driver App', subgroup: 'ROUTE', method: 'GET', path: '/v1/driver/route', 
    desc: 'Get assigned bus route, pickup stops, and passenger manifest', access: 'Token',
    sampleResponse: '{ "routeNumber": "Route 4B", "busNumber": "DL-01-AB-1234", "stops": 8 }'
  },
  { 
    group: 'Driver App', subgroup: 'GPS', method: 'POST', path: '/v1/driver/location', 
    desc: 'Transmit live vehicle GPS coordinates (latitude, longitude, speed)', access: 'Token',
    params: '{ "lat": 28.6139, "lng": 77.2090, "speed": 34.5 }',
    sampleResponse: '{ "success": true, "timestamp": "2026-11-27T17:35:00Z" }'
  },
  { 
    group: 'Driver App', subgroup: 'BOARDING', method: 'POST', path: '/v1/driver/attendance', 
    desc: 'Log student boarding / deboarding RFID scan and notify parents', access: 'Token',
    params: '{ "rfidTag": "TAG-882194", "status": "BOARDED", "stopId": "STP-3" }',
    sampleResponse: '{ "success": true, "notifiedParent": true }'
  },

  // Hardware & Camera AI Endpoints
  { 
    group: 'Camera Agent', subgroup: 'HARDWARE', method: 'POST', path: '/v1/camera/heartbeat', 
    desc: 'Gate camera agent operational heartbeat and status ping', access: 'Token',
    params: '{ "cameraId": "CAM-MAIN-GATE", "fps": 24, "status": "STREAMING" }',
    sampleResponse: '{ "status": "ACK", "serverTime": 1795780000 }'
  },
  { 
    group: 'Camera Agent', subgroup: 'AI_EVENTS', method: 'POST', path: '/v1/camera/detect', 
    desc: 'Transmit real-time face recognition log from edge camera device', access: 'Token',
    params: '{ "cameraId": "CAM-1", "studentId": "STD-101", "confidence": 0.98 }',
    sampleResponse: '{ "success": true, "markedAttendance": "P", "timestamp": "08:14 AM" }'
  },

  // Webhooks & Callbacks
  { 
    group: 'Webhooks', subgroup: 'PAYMENTS', method: 'POST', path: '/v1/webhook/payment', 
    desc: 'Payment gateway server-to-server webhook callback (Razorpay/Cashfree)', access: 'Public',
    params: '{ "event": "payment.captured", "payload": { "payment": { "entity": { "amount": 650000 } } } }',
    sampleResponse: '{ "status": "ok" }'
  },

  // System Diagnostics
  { 
    group: 'Other', subgroup: 'HEALTH', method: 'GET', path: '/v1/health', 
    desc: 'Lightweight liveness probe for load balancers & Render health checks', access: 'Public',
    sampleResponse: '{ "status": "healthy", "service": "School ERP API", "version": "3.6.0" }'
  }
];

const GROUPS = [
  { key: 'SuperAdmin Core', icon: '🚀', color: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700' },
  { key: 'Auth & Core', icon: '🔐', color: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-700' },
  { key: 'Parent App', icon: '👨‍👩‍👧', color: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-700' },
  { key: 'Staff App', icon: '👩‍💼', color: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700' },
  { key: 'Driver App', icon: '🚌', color: 'bg-orange-600', light: 'bg-orange-50', text: 'text-orange-700' },
  { key: 'Camera Agent', icon: '📷', color: 'bg-pink-600', light: 'bg-pink-50', text: 'text-pink-700' },
  { key: 'Webhooks', icon: '🔗', color: 'bg-teal-600', light: 'bg-teal-50', text: 'text-teal-700' },
  { key: 'Other', icon: '⚙️', color: 'bg-slate-600', light: 'bg-slate-100', text: 'text-slate-700' },
];

const METHOD_COLORS = {
  GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  POST: 'bg-blue-50 text-blue-700 border-blue-200',
  PUT: 'bg-amber-50 text-amber-700 border-amber-200',
  PATCH: 'bg-purple-50 text-purple-700 border-purple-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
};

const METHODS = ['All', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const ACCESSES = ['All', 'Token', 'Public'];

export default function ApiDocs() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [activeMethod, setActiveMethod] = useState('All');
  const [activeAccess, setActiveAccess] = useState('All');
  const [openGroups, setOpenGroups] = useState({ 'SuperAdmin Core': true, 'Auth & Core': true });
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const baseUrl = useMemo(() => getBaseUrl(), []);

  const countPerGroup = useMemo(() =>
    ALL_ENDPOINTS.reduce((acc, e) => { acc[e.group] = (acc[e.group] || 0) + 1; return acc; }, {}),
  []);

  const filtered = useMemo(() => {
    return ALL_ENDPOINTS.filter(e => {
      if (activeGroup !== 'All' && e.group !== activeGroup) return false;
      if (activeMethod !== 'All' && e.method !== activeMethod) return false;
      if (activeAccess !== 'All' && e.access !== activeAccess) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.path.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.group.toLowerCase().includes(q) || e.subgroup.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, activeGroup, activeMethod, activeAccess]);

  const groupedFiltered = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      if (!map[e.group]) map[e.group] = {};
      if (!map[e.group][e.subgroup]) map[e.group][e.subgroup] = [];
      map[e.group][e.subgroup].push(e);
    });
    return map;
  }, [filtered]);

  const toggleGroup = (g) => setOpenGroups(o => ({ ...o, [g]: !o[g] }));

  const generateCurl = (endpoint) => {
    const fullUrl = `${baseUrl}${endpoint.path}`;
    let curl = `curl -X ${endpoint.method} "${fullUrl}" \\\n  -H "Content-Type: application/json"`;
    if (endpoint.access === 'Token') {
      curl += ` \\\n  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"`;
    }
    if (endpoint.params && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
      curl += ` \\\n  -d '${endpoint.params.replace(/\n\s*/g, ' ')}'`;
    }
    return curl;
  };

  const handleCopyCurl = (e, endpoint, index) => {
    e.stopPropagation();
    const curl = generateCurl(endpoint);
    navigator.clipboard.writeText(curl);
    setCopiedIndex(index);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'cURL command copied to clipboard!',
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 1. Download Postman Collection v2.1
  const handleDownloadPostman = () => {
    const collection = {
      info: {
        name: "School ERP REST API Collection",
        description: "Official Postman collection for School ERP, mobile apps, and SuperAdmin endpoints",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: GROUPS.map(grp => ({
        name: grp.key,
        item: ALL_ENDPOINTS.filter(e => e.group === grp.key).map(ep => ({
          name: `${ep.method} ${ep.path} - ${ep.desc}`,
          request: {
            method: ep.method,
            header: [
              { key: "Content-Type", value: "application/json" },
              ...(ep.access === 'Token' ? [{ key: "Authorization", value: "Bearer {{JWT_TOKEN}}" }] : [])
            ],
            url: {
              raw: `{{BASE_URL}}${ep.path}`,
              host: ["{{BASE_URL}}"],
              path: ep.path.split('/').filter(Boolean)
            },
            ...(ep.params ? {
              body: {
                mode: "raw",
                raw: ep.params
              }
            } : {})
          }
        }))
      })),
      variable: [
        { key: "BASE_URL", value: baseUrl },
        { key: "JWT_TOKEN", value: "your_jwt_token_here" }
      ]
    };

    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `School_ERP_Postman_Collection_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Download OpenAPI 3.0 Spec
  const handleDownloadOpenAPI = () => {
    const paths = {};
    ALL_ENDPOINTS.forEach(ep => {
      if (!paths[ep.path]) paths[ep.path] = {};
      paths[ep.path][ep.method.toLowerCase()] = {
        summary: ep.desc,
        tags: [ep.group],
        responses: {
          "200": { description: "Successful response" }
        },
        ...(ep.access === 'Token' ? { security: [{ bearerAuth: [] }] } : {})
      };
    });

    const openapi = {
      openapi: "3.0.3",
      info: {
        title: "School ERP Enterprise API",
        version: "3.6.0",
        description: "Comprehensive REST API specification for School ERP, multi-tenant portal and mobile clients"
      },
      servers: [{ url: baseUrl, description: "Active Environment Server" }],
      paths,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    };

    const blob = new Blob([JSON.stringify(openapi, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `School_ERP_OpenAPI_v3_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 3. Download JSON Registry
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(ALL_ENDPOINTS, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `School_ERP_Endpoints_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-16 w-full bg-[#f8fafc] min-h-screen">
      
      {/* ── Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Plug className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Developer API Documentation
              </h1>
              <p className="text-xs text-slate-500">Live endpoint catalog, OpenAPI schemas &amp; cURL integration guides</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={handleDownloadPostman}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            <span>Postman Collection</span>
          </button>

          <button 
            onClick={handleDownloadOpenAPI}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>OpenAPI 3.0 Spec</span>
          </button>

          <button 
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Endpoints JSON</span>
          </button>
        </div>
      </div>

      {/* ── Base URL Banner */}
      <div className="bg-white border border-indigo-100 rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Terminal className="w-4 h-4" />
          </span>
          <div className="text-xs">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Active API Base URL</span>
            <code className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {baseUrl}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
            Bearer JWT required on all protected routes
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(baseUrl);
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Base URL copied!', showConfirmButton: false, timer: 1200 });
            }}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copy URL
          </button>
        </div>
      </div>

      {/* ── Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-6 space-y-3.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search API endpoints by path, keyword, or module..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Group Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveGroup('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeGroup === 'All' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({ALL_ENDPOINTS.length})
          </button>
          {GROUPS.map(g => (
            <button
              key={g.key}
              onClick={() => setActiveGroup(g.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeGroup === g.key ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.key}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeGroup === g.key ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-200 text-slate-500'}`}>
                {countPerGroup[g.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Method & Access Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Method:</span>
            {METHODS.map(m => (
              <button
                key={m}
                onClick={() => setActiveMethod(m)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                  activeMethod === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Access:</span>
            {ACCESSES.map(a => (
              <button
                key={a}
                onClick={() => setActiveAccess(a)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                  activeAccess === a ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Endpoints Accordion List */}
      <div className="space-y-4">
        {Object.keys(groupedFiltered).length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 text-xs font-bold">
            No endpoints match your search criteria.
          </div>
        ) : (
          GROUPS.filter(g => groupedFiltered[g.key]).map(gmeta => {
            const subgroups = groupedFiltered[gmeta.key];
            const totalInGroup = Object.values(subgroups).flat().length;
            const isOpen = !!openGroups[gmeta.key];

            return (
              <div key={gmeta.key} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Group Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(gmeta.key)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${gmeta.color} rounded-xl flex items-center justify-center text-white text-base shadow-xs`}>
                      {gmeta.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-900 text-sm">{gmeta.key}</h3>
                      <p className="text-[11px] text-slate-400">Endpoints for {gmeta.key.toLowerCase()} service layer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {totalInGroup} endpoints
                    </span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Subgroups & Endpoints */}
                {isOpen && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100">
                    {Object.entries(subgroups).map(([sub, routes]) => (
                      <div key={sub} className="p-3 sm:p-4 space-y-2 bg-slate-50/40">
                        <div className="flex items-center gap-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>{sub}</span>
                        </div>

                        <div className="space-y-1.5">
                          {routes.map((r, i) => {
                            const endpointKey = `${r.method}-${r.path}`;
                            const isExpanded = expandedEndpoint === endpointKey;

                            return (
                              <div
                                key={i}
                                className={`rounded-xl border transition-all overflow-hidden ${
                                  isExpanded ? 'bg-white border-indigo-300 shadow-sm' : 'bg-white border-slate-200/80 hover:border-slate-300'
                                }`}
                              >
                                <div
                                  onClick={() => setExpandedEndpoint(isExpanded ? null : endpointKey)}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border text-center shrink-0 w-16 ${METHOD_COLORS[r.method] || 'bg-slate-100 text-slate-600'}`}>
                                      {r.method}
                                    </span>
                                    <code className="text-xs font-mono font-bold text-slate-800 truncate">
                                      {r.path}
                                    </code>
                                    <span className="text-xs text-slate-500 hidden md:inline truncate">
                                      — {r.desc}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                    {r.access === 'Token' ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                        <Lock className="w-3 h-3" /> Token
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                        <Globe className="w-3 h-3" /> Public
                                      </span>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyCurl(e, r, `${sub}-${i}`)}
                                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                                      title="Copy cURL"
                                    >
                                      {copiedIndex === `${sub}-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Endpoint Details */}
                                {isExpanded && (
                                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs space-y-3">
                                    <div>
                                      <span className="font-bold text-slate-700 block mb-0.5">Description:</span>
                                      <p className="text-slate-600">{r.desc}</p>
                                    </div>

                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-700">cURL Example Request:</span>
                                        <button
                                          onClick={(e) => handleCopyCurl(e, r, `exp-${sub}-${i}`)}
                                          className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="w-3 h-3" /> Copy Command
                                        </button>
                                      </div>
                                      <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
                                        {generateCurl(r)}
                                      </pre>
                                    </div>

                                    {r.sampleResponse && (
                                      <div>
                                        <span className="font-bold text-slate-700 block mb-1">Sample Response (200 OK):</span>
                                        <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                                          {r.sampleResponse}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
