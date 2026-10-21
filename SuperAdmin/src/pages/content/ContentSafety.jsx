import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Trash2, Flag, X } from 'lucide-react';

const initFlagged = [
  { id: 1, type: 'Chat Message', school: 'SSVP School', content: 'Inappropriate language detected in parent chat', severity: 'High', time: '10 min ago', status: 'Pending' },
  { id: 2, type: 'Notice Board', school: 'Green Valley', content: 'Spam content detected in notice', severity: 'Medium', time: '1 hour ago', status: 'Pending' },
  { id: 3, type: 'Profile Photo', school: 'Sunrise School', content: 'Inappropriate profile image uploaded', severity: 'High', time: '2 hours ago', status: 'Resolved' },
  { id: 4, type: 'Homework', school: 'Montessori School', content: 'External link in homework description', severity: 'Low', time: '3 hours ago', status: 'Resolved' },
  { id: 5, type: 'Chat Message', school: 'Oxford International', content: 'Bulk messaging pattern detected', severity: 'Medium', time: '5 hours ago', status: 'Pending' },
];

const rules = [
  { name: 'Profanity Filter', desc: 'Block offensive language in chats and notices', enabled: true },
  { name: 'Spam Detection', desc: 'Detect and block spam messages', enabled: true },
  { name: 'Image Moderation', desc: 'AI scan uploaded images for inappropriate content', enabled: true },
  { name: 'Link Scanner', desc: 'Scan external links for malicious content', enabled: false },
  { name: 'Bulk Message Alert', desc: 'Alert on unusual bulk messaging patterns', enabled: true },
];

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-none transition-colors relative ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}>
    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-none shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const ContentSafety = () => {
  const [flaggedContent, setFlaggedContent] = useState(initFlagged);
  const [rulesState, setRulesState] = useState(rules.reduce((a, r) => ({ ...a, [r.name]: r.enabled }), {}));
  const [filter, setFilter] = useState('All');
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const filtered = flaggedContent.filter(c => filter === 'All' || c.status === filter);

  const handleResolve = (id) => setFlaggedContent(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
  const handleDelete = () => {
    setFlaggedContent(prev => prev.filter(c => c.id !== deleteItem.id));
    setDeleteItem(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content Safety</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and moderate platform content</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-none">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-xs font-semibold text-green-700">Safety Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Flagged Today', value: flaggedContent.length, color: 'text-red-500' },
          { label: 'Pending Review', value: flaggedContent.filter(c => c.status === 'Pending').length, color: 'text-orange-500' },
          { label: 'Resolved', value: flaggedContent.filter(c => c.status === 'Resolved').length, color: 'text-green-600' },
          { label: 'Active Rules', value: Object.values(rulesState).filter(Boolean).length, color: 'text-blue-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flagged Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-none border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Flag className="w-4 h-4 text-red-500" />Flagged Content</h3>
              <div className="flex gap-2">
                {['All', 'Pending', 'Resolved'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-none text-xs font-semibold transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map(c => (
                <div key={c.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${c.severity === 'High' ? 'bg-red-50 text-red-600' : c.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600'}`}>{c.severity}</span>
                        <span className="text-xs text-gray-500">{c.type}</span>
                        <span className="text-xs text-gray-400">· {c.school}</span>
                      </div>
                      <p className="text-sm text-gray-700">{c.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{c.time}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${c.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{c.status}</span>
                      <button onClick={() => setViewItem(c)} className="p-1.5 hover:bg-blue-50 rounded-none text-blue-400"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteItem(c)} className="p-1.5 hover:bg-red-50 rounded-none text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Rules */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Safety Rules</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {rules.map(r => (
              <div key={r.name} className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{r.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                </div>
                <Toggle checked={rulesState[r.name]} onChange={v => setRulesState(s => ({ ...s, [r.name]: v }))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-md">
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${viewItem.severity === 'High' ? 'bg-red-50 text-red-600' : viewItem.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-yellow-50 text-yellow-600'}`}>{viewItem.severity}</span>
                  <span className="text-xs text-gray-500">{viewItem.type}</span>
                </div>
                <h2 className="font-bold text-gray-800">{viewItem.school}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{viewItem.time}</p>
              </div>
              <button onClick={() => setViewItem(null)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700 leading-relaxed">{viewItem.content}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${viewItem.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{viewItem.status}</span>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              {viewItem.status === 'Pending' && (
                <button onClick={() => { handleResolve(viewItem.id); setViewItem(v => ({ ...v, status: 'Resolved' })); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-none text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Mark Resolved
                </button>
              )}
              <button onClick={() => setViewItem(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Remove Flagged Item?</h2>
            <p className="text-sm text-gray-500 mb-6">Remove this flagged content from <span className="font-semibold text-gray-700">{deleteItem.school}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentSafety;
