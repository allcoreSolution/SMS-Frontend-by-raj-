import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Type, Image as ImageIcon, Layout, Columns, Box, AlignLeft, 
  Settings, Layers, Undo, Redo, Copy, Trash2, Eye, Plus, FileText, QrCode, 
  MapPin, Phone, Mail, FileBadge, CheckSquare
} from 'lucide-react';

export default function CanvasDesigner() {
  const navigate = useNavigate();
  const [activeLeftTab, setActiveLeftTab] = useState('Fields');
  
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col h-screen overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="bg-[#5F52FF] text-white px-4 py-2 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/id-cards/templates')}
            className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold text-[13px]">Templates</span>
          </button>
          <div className="h-4 w-px bg-white/30"></div>
          <span className="font-semibold text-[14px]">Untitled design — name it here</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded">
            <span className="text-[12px] font-medium">For</span>
            <select className="bg-transparent text-white text-[13px] font-bold outline-none border-none cursor-pointer">
              <option className="text-slate-800">Student</option>
              <option className="text-slate-800">Staff</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded">
            <span className="text-[12px] font-medium">Card size (mm)</span>
            <select className="bg-transparent text-white text-[13px] font-bold outline-none border-none cursor-pointer">
              <option className="text-slate-800">CR80 Portrait — 54 x 85.6</option>
              <option className="text-slate-800">CR80 Landscape — 85.6 x 54</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <input type="text" value="54" className="w-12 bg-white text-slate-800 text-center text-[12px] font-bold rounded-none py-1 outline-none" readOnly />
            <input type="text" value="85.6" className="w-12 bg-white text-slate-800 text-center text-[12px] font-bold rounded-none py-1 outline-none" readOnly />
          </div>
          
          <button className="bg-white text-[#5F52FF] px-4 py-1.5 rounded-none font-bold text-[13px] flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm ml-2">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      
      {/* Secondary Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-slate-600 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-none p-0.5">
            <button className="px-3 py-1 bg-white shadow-sm rounded-none text-[12px] font-bold text-[#5F52FF]">Front</button>
            <button className="px-3 py-1 hover:bg-slate-200 rounded-none text-[12px] font-bold">Back</button>
          </div>
          
          <div className="h-4 w-px bg-slate-300"></div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-none text-[12px] font-bold">
              <Type className="w-4 h-4" /> Text
            </button>
            <button className="w-6 h-6 rounded-none border border-slate-300 flex items-center justify-center hover:bg-slate-100"><span className="w-3 h-3 border border-slate-400"></span></button>
            <button className="w-6 h-6 rounded-none border border-slate-300 flex items-center justify-center hover:bg-slate-100"><span className="w-3 h-3 border border-slate-400 rounded-none"></span></button>
            <button className="w-6 h-6 rounded-none border border-slate-300 flex items-center justify-center hover:bg-slate-100"><span className="w-3 h-0.5 bg-slate-400"></span></button>
            <button className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-none text-[12px] font-bold">
              <ImageIcon className="w-4 h-4" /> Image
            </button>
          </div>
          
          <div className="h-4 w-px bg-slate-300"></div>
          
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-100 rounded"><Undo className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded"><Redo className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <button className="p-1.5 hover:bg-slate-100 rounded"><Copy className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded-none text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:bg-slate-100 px-3 py-1.5 rounded-none text-[12px] font-bold">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium">Card</span>
            <div className="w-6 h-4 border-2 border-slate-300 rounded-none"></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-6 h-6 rounded-none bg-slate-100 flex items-center justify-center text-[14px] font-bold">-</button>
            <span className="text-[12px] font-bold w-10 text-center">209%</span>
            <button className="w-6 h-6 rounded-none bg-slate-100 flex items-center justify-center text-[14px] font-bold">+</button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 p-2 gap-2">
            {['Fields', 'Elements', 'Uploads'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-none text-[11px] font-bold gap-1 transition-colors ${
                  activeLeftTab === tab ? 'bg-blue-50 text-[#5F52FF]' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab === 'Fields' && <FileText className="w-5 h-5" />}
                {tab === 'Elements' && <Box className="w-5 h-5" />}
                {tab === 'Uploads' && <ImageIcon className="w-5 h-5" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            
            {/* Start with a Layout */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">START WITH A LAYOUT</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none p-2 flex flex-col items-center gap-2 transition-colors">
                  <Layout className="w-6 h-6 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Photo on top</span>
                </button>
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none p-2 flex flex-col items-center gap-2 transition-colors">
                  <Columns className="w-6 h-6 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Photo on left</span>
                </button>
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none p-2 flex flex-col items-center gap-2 transition-colors">
                  <AlignLeft className="w-6 h-6 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Coloured header</span>
                </button>
              </div>
            </div>
            
            {/* Add a Block */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">ADD A BLOCK</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none py-2 px-1 flex items-center justify-center gap-1.5 transition-colors">
                  <span className="text-[14px] font-black font-serif">H</span>
                  <span className="text-[11px] font-bold text-slate-600">Name + class</span>
                </button>
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none py-2 px-1 flex items-center justify-center gap-1.5 transition-colors">
                  <FileBadge className="w-4 h-4 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-600">ID details</span>
                </button>
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none py-2 px-1 flex items-center justify-center gap-1.5 transition-colors">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-600">Photo + name</span>
                </button>
                <button className="border border-slate-200 hover:border-[#5F52FF] hover:bg-slate-50 rounded-none py-2 px-1 flex items-center justify-center gap-1.5 transition-colors">
                  <QrCode className="w-4 h-4 text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-600">QR + caption</span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search fields..." 
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-none text-[12px] focus:outline-none focus:border-[#5F52FF] bg-slate-50"
              />
            </div>
            
            {/* Category Lists */}
            {['IMAGES', 'STUDENT', 'CONTACT'].map((category) => (
              <div key={category} className="mb-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h3>
                <div className="flex flex-col gap-1 border border-slate-200 rounded-none overflow-hidden">
                  {category === 'IMAGES' && [
                    { icon: ImageIcon, label: 'Student Photo' },
                    { icon: ImageIcon, label: 'School Logo' },
                    { icon: QrCode, label: 'QR Code (verify)' },
                    { icon: QrCode, label: 'Attendance QR' },
                    { icon: FileText, label: 'Principal Signature' }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-2 hover:bg-slate-50 cursor-pointer ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-slate-500" />
                        <span className="text-[12px] text-slate-700">{item.label}</span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                  
                  {category === 'STUDENT' && [
                    'Student Name', 'Admission No.', 'Roll No.', 'Class & Section', 'Date of Birth', 'Blood Group', 'House', 'Academic Session'
                  ].map((label, i) => (
                    <div key={i} className={`flex items-center justify-between p-2 hover:bg-slate-50 cursor-pointer ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center font-serif text-[12px] font-black text-slate-500">A</span>
                        <span className="text-[12px] text-slate-700">{label}</span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Workspace Canvas Area */}
        <div className="flex-1 bg-slate-100/50 relative overflow-auto flex items-center justify-center p-10" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          {/* Mockup Canvas */}
          <div className="w-[380px] h-[600px] bg-white shadow-2xl relative">
             {/* This represents the blank card as requested "Start from scratch" */}
          </div>
          
          {/* Dimension marker */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-400">
            54 × 85.6 mm
          </div>
        </div>
        
        {/* Right Sidebar - Properties */}
        <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          
          {/* Properties Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h2 className="text-[14px] font-bold text-slate-800">Properties</h2>
            <Settings className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="p-4 border-b border-slate-200">
            <label className="block text-[12px] font-bold text-slate-700 mb-3">Card background</label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {['#ffffff', '#f8f9fa', '#fde68a', '#fed7aa', '#fecaca', '#0f172a', '#1e40af', '#3b82f6', '#8b5cf6', '#a855f7'].map(color => (
                <div key={color} className={`w-8 h-8 rounded-none border border-slate-200 cursor-pointer shadow-sm hover:scale-110 transition-transform ${color === '#ffffff' ? 'ring-2 ring-[#5F52FF] ring-offset-2' : ''}`} style={{ backgroundColor: color }}></div>
              ))}
            </div>
            <button className="w-full py-2 border border-slate-300 rounded-none text-[12px] font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(45deg, red, blue, green, yellow)' }}></div>
              Custom colour
            </button>
          </div>
          
          <div className="p-4 border-b border-slate-200 text-[11px] text-slate-500 space-y-2">
            <p>Select an element on the card to edit it.</p>
            <p className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> "Preview" shows sample data</p>
            <p className="flex items-center gap-1.5"><Layout className="w-3.5 h-3.5" /> Drag to move & resize</p>
            <p className="flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Arrows nudge - Del removes</p>
            <p className="flex items-center gap-1.5"><Undo className="w-3.5 h-3.5" /> Ctrl+Z / Ctrl+Y undo & redo</p>
          </div>
          
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-slate-700" />
              <h2 className="text-[13px] font-bold text-slate-800">Layers</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-[12px]">
              <p>Nothing on this side yet.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
