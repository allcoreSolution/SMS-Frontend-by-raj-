import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PenTool, Search } from 'lucide-react';

const THEMES = [
  { name: 'Indigo', main: '#5F52FF', soft: '#E9E7FF', ink: '#1E1B4B' },
  { name: 'Teal', main: '#0F766E', soft: '#D5F2EE', ink: '#0B3B37' },
  { name: 'Rust', main: '#C2410C', soft: '#FDE5D6', ink: '#431407' },
  { name: 'Crimson', main: '#BE123C', soft: '#FDE0E7', ink: '#4C0519' },
  { name: 'Navy', main: '#1D4ED8', soft: '#DBE7FF', ink: '#0F1E4D' },
];

const categories = [
  { name: 'All', count: 111 },
  { name: 'Academic', count: 1 },
  { name: 'Admit Card', count: 3 },
  { name: 'Bonafide', count: 9 },
  { name: 'Certificate', count: 2 },
  { name: 'Character Certificate', count: 8 },
  { name: 'Dsf', count: 1 },
  { name: 'Fee Receipt', count: 15 },
  { name: 'General', count: 1 },
  { name: 'Id Card', count: 19 },
  { name: 'Interactive', count: 5 },
  { name: 'Marksheet', count: 23 },
  { name: 'Staff Id Card', count: 14 },
  { name: 'Transfer Certificate', count: 9 },
];

/* ---------- small building blocks ---------- */

const Photo = ({ size, bg, fg }) => (
  <div className="relative overflow-hidden shrink-0" style={{ width: size, height: size, background: bg }}>
    <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: '18%', width: '38%', height: '38%', background: fg }} />
    <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: '62%', width: '78%', height: '70%', background: fg }} />
  </div>
);

const Barcode = ({ color, w = 90, h = 14 }) => (
  <div style={{ width: w, height: h, backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px 4px, ${color} 4px 5px, transparent 5px 8px, ${color} 8px 11px, transparent 11px 13px)` }} />
);

const Row = ({ label, value, ink }) => (
  <div className="flex justify-between text-[7px] leading-[11px]">
    <span className="opacity-60">{label}</span>
    <span className="font-semibold" style={{ color: ink }}>{value}</span>
  </div>
);

const fields = (staff) =>
  staff
    ? [['Designation', 'Teacher'], ['Emp. ID', 'EMP-0482'], ['Phone', '98765 43210']]
    : [['Class', 'VIII-B'], ['Roll No', '24'], ['Phone', '98765 43210']];

const Logo = ({ t, dark }) => (
  <div className="w-6 h-6 grid place-items-center text-[10px] font-extrabold shrink-0" style={{ background: dark ? t.main : '#fff', color: dark ? '#fff' : t.main }}>S</div>
);

/* ---------- 6 different card layouts ---------- */

const CLASSIC = ({ t, staff }) => (
  <div className="w-[150px] h-[232px] bg-white shadow-lg flex flex-col">
    <div className="h-[48px] px-2.5 flex items-center gap-1.5 text-white" style={{ background: t.main }}>
      <Logo t={t} />
      <div className="leading-tight">
        <div className="text-[8px] font-bold">Sunrise Public School</div>
        <div className="text-[6px] opacity-80">Affiliated to CBSE</div>
      </div>
    </div>
    <div className="flex flex-col items-center pt-3">
      <Photo size={58} bg={t.soft} fg={t.main} />
      <div className="mt-2 text-[10px] font-bold" style={{ color: t.ink }}>Aarav Sharma</div>
      <div className="text-[7px] opacity-60">{staff ? 'Staff' : 'Student'}</div>
    </div>
    <div className="px-3 mt-2 space-y-0.5">
      {fields(staff).map(([l, v]) => <Row key={l} label={l} value={v} ink={t.ink} />)}
    </div>
    <div className="mt-auto h-[26px] grid place-items-center" style={{ background: t.soft }}>
      <Barcode color={t.ink} w={80} h={12} />
    </div>
  </div>
);

const STRIPE = ({ t, staff }) => (
  <div className="w-[150px] h-[232px] bg-white shadow-lg flex">
    <div className="w-[28px] relative overflow-hidden" style={{ background: t.main }}>
      <div className="absolute top-1/2 left-1/2 -rotate-90 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] font-bold tracking-wide text-white">
        Sunrise Public School
      </div>
    </div>
    <div className="flex-1 p-3 flex flex-col">
      <Photo size={64} bg={t.soft} fg={t.main} />
      <div className="mt-2.5 text-[11px] font-bold leading-tight" style={{ color: t.ink }}>Aarav<br />Sharma</div>
      <div className="mt-1 h-[2px] w-6" style={{ background: t.main }} />
      <div className="mt-2 space-y-0.5">
        {fields(staff).map(([l, v]) => <Row key={l} label={l} value={v} ink={t.ink} />)}
      </div>
      <div className="mt-auto"><Barcode color={t.ink} w={80} h={12} /></div>
    </div>
  </div>
);

const SLANT = ({ t, staff }) => (
  <div className="w-[150px] h-[232px] bg-white shadow-lg flex flex-col relative">
    <div className="h-[92px] w-full text-white p-2.5" style={{ background: t.main, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 0 100%)' }}>
      <div className="text-[8px] font-bold">Sunrise Public School</div>
      <div className="text-[6px] opacity-80">Session 2026-27</div>
    </div>
    <div className="absolute left-3 top-[44px] p-[3px] bg-white"><Photo size={60} bg={t.soft} fg={t.main} /></div>
    <div className="px-3 mt-[26px]">
      <div className="text-[11px] font-bold" style={{ color: t.ink }}>Aarav Sharma</div>
      <div className="text-[7px] opacity-60 mb-1.5">{staff ? 'Teacher' : 'Class VIII-B'}</div>
      <div className="space-y-0.5">
        {fields(staff).map(([l, v]) => <Row key={l} label={l} value={v} ink={t.ink} />)}
      </div>
    </div>
    <div className="mt-auto h-[6px]" style={{ background: t.main }} />
  </div>
);

const MIDNIGHT = ({ t, staff }) => (
  <div className="w-[150px] h-[232px] shadow-lg flex flex-col items-center text-white p-3" style={{ background: t.ink }}>
    <div className="text-[8px] font-bold tracking-wide">Sunrise Public School</div>
    <div className="w-8 h-[2px] mt-1" style={{ background: t.main }} />
    <div className="mt-3 p-[3px]" style={{ border: `2px solid ${t.main}` }}>
      <Photo size={62} bg="#ffffff22" fg="#ffffff88" />
    </div>
    <div className="mt-2 text-[11px] font-bold">Aarav Sharma</div>
    <div className="text-[7px] opacity-60">{staff ? 'Teacher' : 'Class VIII-B'}</div>
    <div className="w-full mt-2.5 space-y-0.5 text-white">
      {fields(staff).map(([l, v]) => <Row key={l} label={l} value={v} ink="#fff" />)}
    </div>
    <div className="mt-auto bg-white p-1"><Barcode color={t.ink} w={70} h={10} /></div>
  </div>
);

const LANDSCAPE = ({ t, staff }) => (
  <div className="w-[236px] h-[148px] bg-white shadow-lg flex flex-col">
    <div className="h-[30px] px-2.5 flex items-center justify-between text-white" style={{ background: t.main }}>
      <div className="flex items-center gap-1.5"><Logo t={t} /><span className="text-[8px] font-bold">Sunrise Public School</span></div>
      <span className="text-[6px] opacity-80">{staff ? 'STAFF ID' : 'STUDENT ID'}</span>
    </div>
    <div className="flex-1 flex gap-3 p-2.5">
      <Photo size={70} bg={t.soft} fg={t.main} />
      <div className="flex-1 flex flex-col">
        <div className="text-[11px] font-bold" style={{ color: t.ink }}>Aarav Sharma</div>
        <div className="h-[2px] w-6 my-1" style={{ background: t.main }} />
        <div className="space-y-0.5">
          {fields(staff).map(([l, v]) => <Row key={l} label={l} value={v} ink={t.ink} />)}
        </div>
        <div className="mt-auto"><Barcode color={t.ink} w={70} h={10} /></div>
      </div>
    </div>
  </div>
);

const HERO = ({ t, staff }) => (
  <div className="w-[150px] h-[232px] bg-white shadow-lg flex flex-col relative overflow-hidden">
    <div className="h-[150px] relative" style={{ background: t.main }}>
      <div className="absolute inset-x-0 bottom-0 top-[18px] flex justify-center">
        <div className="w-[110px] relative overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/40" style={{ top: '14%', width: '40%', height: '36%' }} />
          <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/40" style={{ top: '56%', width: '90%', height: '80%' }} />
        </div>
      </div>
      <div className="absolute top-1.5 left-2 text-[7px] font-bold text-white">Sunrise Public School</div>
    </div>
    <div className="px-3 pt-2">
      <div className="text-[12px] font-bold leading-tight" style={{ color: t.ink }}>Aarav Sharma</div>
      <div className="text-[7px] opacity-60">{staff ? 'Teacher · EMP-0482' : 'Class VIII-B · Roll 24'}</div>
    </div>
    <div className="mt-auto px-3 pb-2"><Barcode color={t.ink} w={90} h={11} /></div>
  </div>
);

const VARIANTS = [
  { name: 'Classic Band', Comp: CLASSIC, orientation: 'Portrait' },
  { name: 'Side Stripe', Comp: STRIPE, orientation: 'Portrait' },
  { name: 'Slant Header', Comp: SLANT, orientation: 'Portrait' },
  { name: 'Midnight', Comp: MIDNIGHT, orientation: 'Portrait' },
  { name: 'Landscape', Comp: LANDSCAPE, orientation: 'Landscape' },
  { name: 'Photo Hero', Comp: HERO, orientation: 'Portrait' },
];

/* ---------- page ---------- */

export default function IdCardTemplates() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Id Card');
  const [query, setQuery] = useState('');

  const templates = useMemo(() => {
    const staff = activeCategory === 'Staff Id Card';
    return Array.from({ length: 10 }).map((_, i) => {
      const v = VARIANTS[i % VARIANTS.length];
      const theme = THEMES[(i + Math.floor(i / VARIANTS.length)) % THEMES.length];
      return { id: i + 1, name: `${v.name} ${theme.name}`, v, theme, staff };
    });
  }, [activeCategory]);

  const visible = templates.filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()));
  const handleStartDesign = () => navigate('/id-cards/canvas-designer');

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex flex-wrap gap-3 items-center justify-between shadow-sm z-10 relative">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Template Gallery</h1>
          <p className="text-[13px] text-slate-500 mt-1">Pick a pre-built design, or start fresh</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleStartDesign} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-[13px] flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5F52FF]">
            <FileText className="w-4 h-4" /> Start from scratch
          </button>
          <button onClick={handleStartDesign} className="px-4 py-2 bg-[#5F52FF] hover:bg-[#4f42e6] text-white border border-[#5F52FF] font-bold text-[13px] flex items-center gap-2 transition-colors shadow-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F52FF]">
            <PenTool className="w-4 h-4" /> Canvas designer
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center gap-4 overflow-x-auto shadow-sm">
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 text-[13px] text-slate-600 focus:outline-none focus:border-[#5F52FF]"
          />
        </div>
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat) => {
            const active = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-[12px] font-bold cursor-pointer transition-colors ${active ? 'bg-[#5F52FF] text-white border-[#5F52FF]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
              >
                {cat.name}
                <span className={`px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="max-w-[1400px] mx-auto bg-white border border-dashed border-slate-300 py-16 text-center">
            <p className="text-[14px] font-bold text-slate-700">No template matches "{query}"</p>
            <p className="text-[12px] text-slate-500 mt-1">Try a colour like Indigo or a style like Midnight.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
            {visible.map(({ id, name, v, theme, staff }) => (
              <div key={id} className="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-shadow">
                <div className="h-[280px] w-full flex items-center justify-center relative" style={{ background: theme.soft }}>
                  <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.ink} 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />
                  <div className="relative transition-transform duration-200 group-hover:-translate-y-1">
                    <v.Comp t={theme} staff={staff} />
                  </div>
                </div>

                <div className="p-3 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-bold text-slate-800">{name}</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="w-2.5 h-2.5" style={{ background: theme.main }} />
                      {v.orientation}
                    </span>
                  </div>
                  <button
                    onClick={handleStartDesign}
                    className="w-full py-2 bg-[#f8f9ff] text-[#5F52FF] font-bold text-[12px] hover:bg-[#5F52FF] hover:text-white transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5F52FF]"
                  >
                    Use this template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}