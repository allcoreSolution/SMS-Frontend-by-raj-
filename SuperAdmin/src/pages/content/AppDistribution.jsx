import React, { useState } from 'react';
import { Smartphone, Download, Star, RefreshCw, Apple, Play, X, CheckCircle } from 'lucide-react';

const versions = [
  { platform: 'Android', version: '2.4.1', status: 'Live', downloads: '12,450', rating: 4.3, size: '28 MB', updated: 'Aug 28, 2024' },
  { platform: 'iOS', version: '2.4.0', status: 'Live', downloads: '8,230', rating: 4.5, size: '32 MB', updated: 'Aug 25, 2024' },
];

const releases = [
  { version: '2.4.1', platform: 'Android', date: 'Aug 28, 2024', notes: 'Bug fixes for fee module, improved performance', status: 'Live' },
  { version: '2.4.0', platform: 'Both', date: 'Aug 20, 2024', notes: 'New: QR attendance, improved chat, dark mode', status: 'Live' },
  { version: '2.3.5', platform: 'Both', date: 'Aug 01, 2024', notes: 'Security patches and stability improvements', status: 'Archived' },
  { version: '2.5.0', platform: 'Both', date: 'Sep 15, 2024', notes: 'AI features, new dashboard, biometric support', status: 'Upcoming' },
];

const AppDistribution = () => {
  const [pushing, setPushing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateNote, setUpdateNote] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePushUpdate = () => {
    if (!updateNote.trim()) return;
    setPushing(true);
    setShowModal(false);
    setTimeout(() => {
      setPushing(false);
      showToast('Update pushed successfully to all devices!');
      setUpdateNote('');
    }, 2500);
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none shadow-lg bg-green-500 text-white text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">App Distribution</h1>
          <p className="text-sm text-gray-500 mt-1">Manage mobile app versions and distribution</p>
        </div>
        <button onClick={() => setShowModal(true)} disabled={pushing}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold disabled:opacity-60 transition-colors">
          {pushing ? <><RefreshCw className="w-4 h-4 animate-spin" />Pushing...</> : <><RefreshCw className="w-4 h-4" />Push Update</>}
        </button>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {versions.map((v, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-none flex items-center justify-center ${v.platform === 'Android' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {v.platform === 'Android' ? <Play className="w-6 h-6 text-green-600" /> : <Apple className="w-6 h-6 text-gray-700" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{v.platform}</h3>
                  <p className="text-xs text-gray-500">v{v.version}</p>
                </div>
              </div>
              <span className="text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-none">{v.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-none p-2">
                <p className="text-sm font-bold text-gray-800">{v.downloads}</p>
                <p className="text-[10px] text-gray-500">Downloads</p>
              </div>
              <div className="bg-gray-50 rounded-none p-2">
                <p className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{v.rating}
                </p>
                <p className="text-[10px] text-gray-500">Rating</p>
              </div>
              <div className="bg-gray-50 rounded-none p-2">
                <p className="text-sm font-bold text-gray-800">{v.size}</p>
                <p className="text-[10px] text-gray-500">Size</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-gray-200 rounded-none hover:bg-gray-50 text-gray-600 font-semibold">
                Store Page
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-none font-semibold">
                <Download className="w-3 h-3" /> Download APK
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Release History */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Release History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Version', 'Platform', 'Release Date', 'Release Notes', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {releases.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-gray-800">v{r.version}</td>
                  <td className="px-4 py-3 text-gray-600">{r.platform}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.date}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">{r.notes}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${r.status === 'Live' ? 'bg-green-50 text-green-600' : r.status === 'Upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PUSH UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Push Update</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Release Notes</label>
                <textarea value={updateNote} onChange={e => setUpdateNote(e.target.value)} rows={3}
                  placeholder="What's new in this update..."
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-none p-3 text-xs text-orange-700">
                This will push a force update notification to all Android & iOS users.
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handlePushUpdate} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-none text-sm font-semibold">Push Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDistribution;
