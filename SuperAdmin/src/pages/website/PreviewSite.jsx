import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Lock, Globe, ZoomIn, ZoomOut } from 'lucide-react';

const PREVIEW_URL = 'https://multischoolv2.projectworlds.com';

export default function PreviewSite() {
  const [device, setDevice] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [zoom, setZoom] = useState(100);

  const devices = [
    { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%', resolution: 'Full Width' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px', resolution: '768px' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px', resolution: '375px' },
  ];

  const currentDevice = devices.find(d => d.id === device);

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey(k => k + 1);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Preview Site</h1>
          <p className="text-sm text-gray-500 mt-1">Preview your public landing page across different devices</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href={PREVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open Live Site
          </a>
        </div>
      </div>

      {/* Demo Warning */}
      <div className="flex items-center gap-2 bg-[#fff8e1] border border-[#fde68a] rounded-none p-3 mb-5 text-sm text-[#854d0e]">
        <Lock className="w-4 h-4 text-[#ca8a04] flex-shrink-0" />
        <p><strong>Demo mode:</strong> this is a live embed of the public site. Some interactive features may be restricted inside the preview frame.</p>
      </div>

      {/* Browser Toolbar */}
      <div className="bg-[#2d2d2d] rounded-none px-4 py-2.5 flex items-center gap-3">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-none bg-red-500"></div>
          <div className="w-3 h-3 rounded-none bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-none bg-green-500"></div>
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-none p-0.5">
          {devices.map(d => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              title={d.label}
              className={`p-1.5 rounded-none transition-colors ${device === d.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <d.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] border border-[#444] rounded-none px-3 py-1.5 max-w-lg">
          <Globe className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
          <span className="text-xs text-gray-300 truncate font-mono">{PREVIEW_URL}</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400 font-bold flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-none bg-green-400 inline-block"></span> LIVE
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 text-gray-400 hover:text-white rounded-none"><ZoomOut className="w-3.5 h-3.5" /></button>
          <span className="text-xs text-gray-400 w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-1 text-gray-400 hover:text-white rounded-none"><ZoomIn className="w-3.5 h-3.5" /></button>
        </div>

        {/* Resolution label */}
        <span className="text-xs text-gray-500 font-mono flex-shrink-0">{currentDevice.resolution}</span>
      </div>

      {/* Preview Frame Container */}
      <div className="bg-[#f0f0f0] border border-t-0 border-gray-300 rounded-none p-6 flex justify-center overflow-auto" style={{ minHeight: '600px' }}>
        <div
          className="bg-white overflow-hidden shadow-xl rounded-none border border-gray-200 transition-all duration-300 origin-top"
          style={{
            width: currentDevice.width,
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[560px] text-gray-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium">Loading preview...</p>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              src={PREVIEW_URL}
              title="Site Preview"
              className="w-full"
              style={{ height: '600px', border: 'none' }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
        </div>
      </div>

      {/* Device Selector row */}
      <div className="mt-4 flex items-center justify-center gap-6">
        {devices.map(d => (
          <button
            key={d.id}
            onClick={() => setDevice(d.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-none transition-colors ${device === d.id ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <d.icon className="w-5 h-5" />
            <span className="text-xs">{d.label}</span>
            <span className="text-[10px] text-gray-400">{d.resolution}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
