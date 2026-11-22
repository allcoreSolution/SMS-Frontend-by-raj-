import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Shield, Globe, ZoomIn, ZoomOut } from 'lucide-react';
import landingPageService from '../../api/landingPageService';

export default function PreviewSite() {
  const [device, setDevice] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [activeTemplateHtml, setActiveTemplateHtml] = useState('');
  const [activeTemplateName, setActiveTemplateName] = useState('ALL CORE SOLUTION Live Landing');

  const devices = [
    { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%', resolution: 'Full Width' },
    { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px', resolution: '768px' },
    { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px', resolution: '375px' },
  ];

  const currentDevice = devices.find(d => d.id === device) || devices[0];

  const fetchLivePreview = async () => {
    setLoading(true);
    try {
      const data = await landingPageService.getHtmlTemplates();
      if (data && data.activeTemplate) {
        setActiveTemplateHtml(data.activeTemplate.htmlContent || '');
        setActiveTemplateName(data.activeTemplate.name || 'Live Template');
      }
    } catch (err) {
      console.warn('Could not load active template preview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePreview();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey(k => k + 1);
    fetchLivePreview();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Preview Site</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
              LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time preview of your active public educational services landing page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Public Site</span>
          </a>
        </div>
      </div>

      {/* Browser Chrome Toolbar */}
      <div className="bg-slate-900 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-xl border border-slate-800">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 shrink-0">
          {devices.map(d => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              title={d.label}
              className={`p-1.5 rounded-md transition cursor-pointer ${device === d.id ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <d.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 max-w-lg min-w-0">
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-300 truncate font-mono">
            allcoresolution.com — {activeTemplateName}
          </span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-extrabold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 text-slate-400 hover:text-white rounded cursor-pointer">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-slate-300 w-10 text-center font-mono">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-1 text-slate-400 hover:text-white rounded cursor-pointer">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Frame Container */}
      <div className="bg-slate-950/80 rounded-3xl border border-slate-800 p-4 sm:p-6 flex justify-center overflow-auto min-h-[620px] shadow-2xl">
        <div
          className="bg-white overflow-hidden shadow-2xl rounded-2xl border border-slate-700 transition-all duration-300"
          style={{
            width: currentDevice.width,
            maxWidth: '100%',
            height: '640px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-xs font-bold">Rendering template preview...</p>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              srcDoc={activeTemplateHtml || `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>ALL CORE SOLUTION Live Landing</h2><p>Previewing current production template.</p></body></html>`}
              title="Site Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
}
