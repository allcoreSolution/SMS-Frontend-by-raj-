import React, { useState } from 'react';
import { Save, Download, Undo, Redo, Type, Image, Square, Circle, Minus, AlignLeft, AlignCenter, AlignRight, Bold, Italic, CheckCircle } from 'lucide-react';

const initElements = [
  { id: 1, type: 'text', label: 'School Name', x: 50, y: 30, fontSize: 20, bold: true, color: '#1f2937' },
  { id: 2, type: 'text', label: 'Student Name: {{student_name}}', x: 50, y: 55, fontSize: 14, bold: false, color: '#1f2937' },
  { id: 3, type: 'text', label: 'Class: {{class}} | Roll No: {{roll}}', x: 50, y: 70, fontSize: 12, bold: false, color: '#1f2937' },
  { id: 4, type: 'text', label: 'This is to certify that the above student...', x: 50, y: 85, fontSize: 11, bold: false, color: '#1f2937' },
];

const variables = ['{{student_name}}', '{{class}}', '{{section}}', '{{roll}}', '{{school_name}}', '{{date}}', '{{principal_name}}', '{{admission_no}}'];

const CanvasDesigner = () => {
  const [elements, setElements] = useState(initElements);
  const [selected, setSelected] = useState(null);
  const [canvasSize, setCanvasSize] = useState('A4 Landscape');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const selectedEl = elements.find(e => e.id === selected);

  const updateElement = (key, value) => {
    setElements(prev => prev.map(e => e.id === selected ? { ...e, [key]: value } : e));
  };

  const addTextElement = () => {
    const newEl = { id: Date.now(), type: 'text', label: 'New Text', x: 50, y: 50, fontSize: 14, bold: false, color: '#1f2937' };
    setElements(prev => [...prev, newEl]);
    setSelected(newEl.id);
  };

  const insertVariable = (v) => {
    if (!selected) return;
    updateElement('label', (selectedEl?.label || '') + v);
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none shadow-lg bg-green-500 text-white text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Canvas Designer</h1>
          <p className="text-sm text-gray-500 mt-1">Design certificates and ID cards visually</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Template exported as PDF!')}
            className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-none text-sm font-semibold">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={() => showToast('Template saved successfully!')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold">
            <Save className="w-4 h-4" /> Save Template
          </button>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Left Toolbar */}
        <div className="w-48 flex-shrink-0 space-y-3">
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-3">
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase">Add Elements</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Type, label: 'Text', action: addTextElement },
                { icon: Image, label: 'Image', action: () => showToast('Image upload coming soon!') },
                { icon: Square, label: 'Rectangle', action: () => showToast('Shape added!') },
                { icon: Circle, label: 'Circle', action: () => showToast('Shape added!') },
                { icon: Minus, label: 'Line', action: () => showToast('Line added!') },
              ].map((el, i) => (
                <button key={i} onClick={el.action}
                  className="flex flex-col items-center gap-1 p-2 border border-gray-200 rounded-none hover:bg-orange-50 hover:border-orange-300 transition-colors text-gray-600 hover:text-orange-600">
                  <el.icon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{el.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-3">
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase">Canvas</p>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Size</label>
                <select value={canvasSize} onChange={e => setCanvasSize(e.target.value)}
                  className="w-full border border-gray-200 rounded-none px-2 py-1 text-xs focus:outline-none">
                  <option>A4 Landscape</option>
                  <option>A4 Portrait</option>
                  <option>ID Card</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-7 rounded-none border border-gray-200 cursor-pointer" />
                  <span className="text-xs font-mono text-gray-500">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-3">
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase">Variables</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {variables.map((v, i) => (
                <button key={i} onClick={() => insertVariable(v)}
                  className="w-full text-left text-[10px] font-mono bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 px-2 py-1 rounded-none transition-colors">
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border border-gray-200 rounded-none shadow-sm p-2 mb-3 flex items-center gap-2 flex-wrap">
            <button className="p-1.5 hover:bg-gray-100 rounded-none text-gray-500"><Undo className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-none text-gray-500"><Redo className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button onClick={() => selected && updateElement('bold', !selectedEl?.bold)}
              className={`p-1.5 rounded-none transition-colors ${selectedEl?.bold ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}>
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-none text-gray-500"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button className="p-1.5 hover:bg-gray-100 rounded-none text-gray-500"><AlignLeft className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-none text-gray-500"><AlignCenter className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-100 rounded-none text-gray-500"><AlignRight className="w-4 h-4" /></button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <select value={selectedEl?.fontSize || 14}
              onChange={e => selected && updateElement('fontSize', Number(e.target.value))}
              className="border border-gray-200 rounded-none px-2 py-1 text-xs focus:outline-none">
              {[10, 11, 12, 14, 16, 18, 20, 24, 28, 32].map(s => <option key={s}>{s}</option>)}
            </select>
            {selected && (
              <button onClick={() => { setElements(p => p.filter(e => e.id !== selected)); setSelected(null); }}
                className="ml-auto text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1 hover:bg-red-50 rounded-none">
                Delete Element
              </button>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 rounded-none border border-gray-200 overflow-auto flex items-center justify-center p-4">
            <div className="shadow-2xl relative" style={{ width: '700px', height: '495px', background: bgColor, border: '1px solid #e5e7eb' }}>
              <div className="absolute inset-3 border-2 border-orange-200 pointer-events-none" />
              <div className="absolute inset-4 border border-orange-100 pointer-events-none" />

              {elements.map(el => (
                <div key={el.id}
                  onClick={() => setSelected(el.id)}
                  className={`absolute cursor-pointer px-1 ${selected === el.id ? 'outline outline-2 outline-orange-400 outline-offset-1' : 'hover:outline hover:outline-1 hover:outline-blue-300'}`}
                  style={{ left: `${el.x}%`, top: `${el.y}%`, transform: 'translate(-50%, -50%)', fontSize: `${el.fontSize}px`, fontWeight: el.bold ? 'bold' : 'normal', color: el.color, whiteSpace: 'nowrap' }}>
                  {el.label}
                </div>
              ))}

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
                <div className="w-32 border-b border-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Principal Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Properties */}
        <div className="w-44 flex-shrink-0">
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-3">
            <p className="text-xs font-bold text-gray-600 mb-3 uppercase">Properties</p>
            {selectedEl ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Text</label>
                  <textarea rows={2}
                    value={selectedEl.label}
                    onChange={e => updateElement('label', e.target.value)}
                    className="w-full border border-gray-200 rounded-none px-2 py-1 text-xs focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Font Size</label>
                  <input type="number"
                    value={selectedEl.fontSize}
                    onChange={e => updateElement('fontSize', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-none px-2 py-1 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color"
                      value={selectedEl.color}
                      onChange={e => updateElement('color', e.target.value)}
                      className="w-8 h-7 rounded-none border border-gray-200 cursor-pointer" />
                    <span className="text-[10px] font-mono text-gray-500">{selectedEl.color}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Bold</label>
                  <button onClick={() => updateElement('bold', !selectedEl.bold)}
                    className={`w-full py-1 rounded-none text-xs font-semibold transition-colors ${selectedEl.bold ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {selectedEl.bold ? 'Bold ON' : 'Bold OFF'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">Click an element to edit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDesigner;
