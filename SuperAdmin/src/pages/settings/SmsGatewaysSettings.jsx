import React, { useState } from 'react';
import {
  Lock, MessageSquare, CheckCircle2, Star, Edit3, Send,
  X, Check, Eye, EyeOff, Copy, AlertCircle, Sparkles, Shield, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import SettingsLayout from '../../components/SettingsLayout';

const INITIAL_SMS_GATEWAYS = [
  { id: 'twilio', name: 'Twilio', logo: '🔴', region: 'Global', usage: 'In use for platform messaging', active: true, isDefault: false, accountSid: '', authToken: '', senderId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/twilio/webhook' },
  { id: 'gupshup', name: 'Gupshup', logo: '⚡', region: 'India', usage: 'In use for platform messaging', active: true, isDefault: false, accountSid: '', authToken: '', senderId: '', dltEntityId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/gupshup/webhook' },
  { id: '360dialog', name: '360dialog (WhatsApp)', logo: '💬', region: 'Global', usage: 'Not currently used', active: false, isDefault: false, accountSid: '', authToken: '', senderId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/360dialog/webhook' },
  { id: 'custom_http', name: 'Custom (HTTP URL)', logo: '🎛️', region: 'Global', usage: 'In use for platform messaging', active: true, isDefault: false, accountSid: '', authToken: '', senderId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/custom/webhook' },
  { id: 'africastalking', name: "Africa's Talking", logo: '🌱', region: 'Africa', usage: 'In use for platform messaging', active: true, isDefault: true, accountSid: '', authToken: '', senderId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/africastalking/webhook' },
  { id: 'msg91', name: 'MSG91', logo: '🔵', region: 'India', usage: 'Not currently used', active: false, isDefault: false, accountSid: '', authToken: '', senderId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/msg91/webhook' },
  { id: 'beem_africa', name: 'Beem Africa', logo: '🟨', region: 'Africa', usage: 'Not currently used', active: false, isDefault: false, accountSid: '', authToken: '', senderId: '', webhookUrl: 'https://api.multischoolerp.com/v1/sms/beem/webhook' },
  { id: 'fast2sms', name: 'Fast2SMS', logo: '🚀', region: 'India', usage: 'Not currently used', active: false, isDefault: false, accountSid: '', authToken: '', senderId: 'FSTSMS', webhookUrl: 'https://api.multischoolerp.com/v1/sms/fast2sms/webhook' },
];

export default function SmsGatewaysSettings({ inSettingsCenter = false }) {
  const [gateways, setGateways] = useState(() => {
    const saved = localStorage.getItem('superadmin_sms_gateways');
    return saved ? JSON.parse(saved) : INITIAL_SMS_GATEWAYS;
  });
  const [demoBanner, setDemoBanner] = useState(false);
  const [editingGw, setEditingGw] = useState(null);
  const [editForm, setEditForm] = useState({ accountSid: '', authToken: '', senderId: '', dltEntityId: '', active: false, isDefault: false });
  const [showToken, setShowToken] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [testingGw, setTestingGw] = useState(null);
  const [testMobile, setTestMobile] = useState('');
  const [testMessage, setTestMessage] = useState('SCHOOL ERP Test SMS from SuperAdmin Dashboard.');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const updateAndSave = (newList) => {
    setGateways(newList);
    localStorage.setItem('superadmin_sms_gateways', JSON.stringify(newList));
  };

  const activeGateways = gateways.filter(g => g.active).length;

  const handleSetDefault = (id) => {
    updateAndSave(gateways.map(g => ({ ...g, isDefault: g.id === id, active: g.id === id ? true : g.active })));
  };

  const openEditDrawer = (gw) => {
    setEditingGw(gw);
    setEditForm({ accountSid: gw.accountSid || '', authToken: gw.authToken || '', senderId: gw.senderId || '', dltEntityId: gw.dltEntityId || '', active: gw.active, isDefault: gw.isDefault });
    setShowToken(false);
    setEditSuccess(false);
  };

  const handleSaveEdit = () => {
    if (!editingGw) return;
    const updated = gateways.map(g => {
      if (g.id === editingGw.id) return { ...g, ...editForm, usage: editForm.active ? 'In use for platform messaging' : 'Not currently used' };
      if (editForm.isDefault && g.id !== editingGw.id) return { ...g, isDefault: false };
      return g;
    });
    updateAndSave(updated);
    setEditSuccess(true);
    Swal.fire({
      icon: 'success',
      title: 'Provider Saved',
      text: `${editingGw.name} settings updated successfully.`,
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => { setEditSuccess(false); setEditingGw(null); }, 1000);
  };

  const openTestModal = (gw) => { setTestingGw(gw); setTestResult(null); setIsSending(false); };

  const handleSendTestSMS = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTestResult(null);
    setTimeout(() => {
      setIsSending(false);
      setTestResult({ success: true, message: `Test SMS sent via ${testingGw.name}! ID: MSG_${Math.floor(100000 + Math.random() * 900000)}` });
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ['Gateway ID', 'Name', 'Region', 'Status', 'Usage', 'Is Default'];
    const rows = gateways.map(g => [`"${g.id}"`, `"${g.name}"`, `"${g.region}"`, `"${g.active ? 'Active' : 'Inactive'}"`, `"${g.usage}"`, `"${g.isDefault ? 'Yes' : 'No'}"`]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `sms_gateways_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const mainContent = (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] w-full mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">SMS Gateways</h1>
            <p className="text-sm text-gray-500 mt-0.5">Providers used to deliver platform SMS &amp; WhatsApp notifications.</p>
          </div>
          <button onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-none-none text-xs font-semibold transition-all self-start">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>



        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total SMS Gateways', value: '32', icon: <MessageSquare className="w-5 h-5 text-gray-500" />, isTag: false },
            { label: 'Active Gateways', value: activeGateways, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, isTag: false },
            { label: 'Platform Default', value: "Africa's Talking", icon: <Star className="w-5 h-5 text-purple-500" />, isTag: true },
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-none-none p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                <div className="w-10 h-10 rounded-none-none bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                  {s.icon}
                </div>
              </div>
              {s.isTag ? (
                <div className="mt-2">
                  <span className="px-2.5 py-1 rounded-none-none text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/60 inline-flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {s.value}
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="bg-white border border-gray-200 rounded-none-none px-4 py-3 text-xs text-gray-600 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-purple-500 fill-current flex-shrink-0" />
          <span>The <strong className="text-purple-800">Platform default</strong> gateway handles SMS when a school has no custom gateway configured. Only <strong className="text-emerald-700">Active</strong> gateways process live traffic.</span>
        </div>

        {/* Gateway List */}
        <div className="bg-white border border-gray-200 rounded-none-none overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">Configured Providers</span>
            <span className="text-xs text-gray-400">{gateways.length} gateways</span>
          </div>
          <div className="divide-y divide-gray-100">
            {gateways.map(gw => (
              <div key={gw.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none-none bg-gray-100 border border-gray-200 text-base flex items-center justify-center flex-shrink-0">{gw.logo}</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-gray-800">{gw.name}</h4>
                      {gw.isDefault && <span className="px-1.5 py-0.5 rounded-none-none text-xs font-semibold bg-purple-100 text-purple-700">Default</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{gw.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end flex-shrink-0">
                  {gw.active
                    ? <span className="px-2.5 py-1 rounded-none-none text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                    : <span className="px-2.5 py-1 rounded-none-none text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">Inactive</span>
                  }
                  <button onClick={() => openEditDrawer(gw)}
                    className="px-3 py-1.5 rounded-none-none bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium transition-all flex items-center gap-1.5">
                    <Edit3 className="w-3 h-3 text-gray-400" /> Edit
                  </button>
                  <button onClick={() => openTestModal(gw)}
                    className="px-3 py-1.5 rounded-none-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5">
                    <Send className="w-3 h-3" /> Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      {editingGw && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-[1150px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-none-none bg-gray-100 text-xl flex items-center justify-center">{editingGw.logo}</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Edit {editingGw.name}</h3>
                  <p className="text-xs text-gray-500">{editingGw.region} Gateway</p>
                </div>
              </div>
              <button onClick={() => setEditingGw(null)} className="p-1.5 rounded-none-none text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-none-none p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Active Status</p>
                    <p className="text-xs text-gray-500">Enable this provider for platform messaging</p>
                  </div>
                  <button type="button" onClick={() => setEditForm(f => ({ ...f, active: !f.active }))}
                    className={`relative w-9 h-5 rounded-none-none transition-colors ${editForm.active ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform ${editForm.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-800 flex items-center gap-1"><Star className="w-3 h-3 fill-current text-purple-500" /> Platform Default</p>
                    <p className="text-xs text-gray-500">Send system SMS when no school gateway is set</p>
                  </div>
                  <button type="button" onClick={() => handleSetDefault(editingGw.id)}
                    className={`px-2.5 py-1 rounded-none-none text-xs font-semibold transition-all ${editingGw.isDefault ? 'bg-purple-600 text-white' : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'}`}>
                    {editingGw.isDefault ? 'Current Default' : 'Set Default'}
                  </button>
                </div>
              </div>

              {[
                { label: 'Account SID / Username / Key', field: 'accountSid', placeholder: 'Enter account SID or username', required: true },
                { label: 'Sender ID / Header', field: 'senderId', placeholder: 'e.g. SCHOOL' },
              ].map(({ label, field, placeholder, required }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
                  <input type="text" value={editForm[field]} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Auth Token / API Secret <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showToken ? 'text' : 'password'} value={editForm.authToken} onChange={e => setEditForm(f => ({ ...f, authToken: e.target.value }))} placeholder="Enter auth token..."
                    className="w-full border border-gray-200 rounded-none-none px-3 py-2 pr-10 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {(editingGw.region === 'India' || ['gupshup', 'msg91', 'fast2sms'].includes(editingGw.id)) && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">DLT Entity ID (India DLT Compliance)</label>
                  <input type="text" value={editForm.dltEntityId} onChange={e => setEditForm(f => ({ ...f, dltEntityId: e.target.value }))} placeholder="e.g. 10019283120"
                    className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-none-none p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-blue-800 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-500" /> Delivery Report Webhook</span>
                  <button type="button" onClick={() => navigator.clipboard.writeText(editingGw.webhookUrl)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                </div>
                <code className="text-xs text-blue-800 bg-white border border-blue-100 rounded-none-none px-2.5 py-1.5 block break-all font-mono">{editingGw.webhookUrl}</code>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
              <button onClick={() => setEditingGw(null)} className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleSaveEdit}
                className={`px-5 py-2 rounded-none-none text-xs font-semibold text-white transition-all flex items-center gap-1.5 ${editSuccess ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {editSuccess ? <><Check className="w-3.5 h-3.5" /> Saved!</> : 'Save Provider'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test SMS Modal */}
      {testingGw && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-[1150px] bg-white rounded-none-none shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-none-none bg-gray-100 text-xl flex items-center justify-center">{testingGw.logo}</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Test {testingGw.name}</h3>
                  <p className="text-xs text-gray-500">Send an instant test SMS</p>
                </div>
              </div>
              <button onClick={() => setTestingGw(null)} className="p-1.5 rounded-none-none text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSendTestSMS} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Recipient Mobile Number</label>
                <input type="text" required value={testMobile} onChange={e => setTestMobile(e.target.value)} placeholder="+919876543210"
                  className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Test Message Body</label>
                <textarea rows={3} required value={testMessage} onChange={e => setTestMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
              </div>
              {testResult && (
                <div className={`p-3 rounded-none-none text-xs font-medium flex items-center gap-2 ${testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {testResult.success ? <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={() => setTestingGw(null)} className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800">Close</button>
                <button type="submit" disabled={isSending}
                  className="px-5 py-2 rounded-none-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-2">
                  <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-bounce' : ''}`} />
                  {isSending ? 'Sending...' : 'Send Test SMS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  if (inSettingsCenter) {
    return <SettingsLayout activeTab="sms-gateways">{mainContent}</SettingsLayout>;
  }
  return mainContent;
}
