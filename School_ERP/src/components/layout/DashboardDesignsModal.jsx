import React from 'react';
import { X, Check } from 'lucide-react';

const DashboardDesignsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const designs = [
    { id: 1, name: 'Classic Dashboard (Legacy)', active: true, tag: '' },
    { id: 2, name: 'Action V2 (Clean)', active: false, tag: '' },
    { id: 3, name: 'Action V2 (Colorful)', active: false, tag: '' },
    { id: 4, name: 'Action V3 (Smart Auto-Arrange)', active: false, tag: '✨' },
    { id: 5, name: 'Mac OS Style (Informative & Active)', active: false, tag: '🍎' },
    { id: 6, name: 'Futuristic Command Center (Extreme Data)', active: false, tag: '🚀' },
    { id: 7, name: 'Minimal Workspace (Focused)', active: false, tag: '🧘' },
    { id: 8, name: 'Enterprise Pro (Data Heavy)', active: false, tag: '🏢' },
  ];

  return (
    <>
      {/* Backdrop (hidden but catches clicks) */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Modal - absolute position */}
      <div 
        className="absolute top-[calc(100%+12px)] left-0 w-[500px] max-w-[90vw] bg-white rounded-xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-900/10 z-50 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-2 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-[17px] font-bold text-slate-800">Dashboard Designs</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Click any design to try it instantly — preview only.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Layouts Grid */}
        <div className="p-4 overflow-y-auto bg-slate-50/50">
          <div className="grid grid-cols-2 gap-4">
            {designs.map((design) => (
              <div 
                key={design.id}
                className={`group cursor-pointer rounded-xl bg-white border ${
                  design.active ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                } transition-all duration-200 flex flex-col overflow-hidden relative`}
              >
                {/* Checkbox for active state */}
                {design.active && (
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white p-0.5 rounded-full shadow-md z-10">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                
                {/* Mock Thumbnail / Preview Image */}
                <div className="h-28 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-50 transition-colors p-1.5">
                  <img 
                      src={`https://placehold.co/400x250/e2e8f0/475569?text=Theme+${design.id}`} 
                      alt={design.name} 
                      className="w-full h-full object-cover rounded-md shadow-sm border border-slate-200/50" 
                  />
                </div>

                {/* Title */}
                <div className="px-3 py-2 bg-white">
                  <h3 className={`text-[12px] font-semibold text-slate-700 flex justify-between items-center ${design.active ? 'text-indigo-700' : ''}`}>
                    {design.name} {design.tag && <span className="text-sm leading-none">{design.tag}</span>}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </>
  );
};

export default DashboardDesignsModal;
