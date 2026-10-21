import React from 'react';
import {
  BookOpen,
  Layers,
  QrCode,
  Users,
  TrendingDown,
  Wrench,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function AssetGuideTab() {
  const steps = [
    {
      num: 1,
      title: 'Categorise & Establish Policy',
      icon: Layers,
      color: 'bg-indigo-600',
      desc: 'Define institutional categories such as IT Hardware, Smart AV Panels, Lab Apparatus, or Power Utilities. Set straight-line or WDV depreciation policies and default useful life on the category once — all registered assets inherit these parameters automatically.'
    },
    {
      num: 2,
      title: 'Register, Serialise & Tag',
      icon: QrCode,
      color: 'bg-blue-600',
      desc: 'Enroll each capital item with its purchase invoice, cost, vendor warranty, and unique institutional asset code (e.g. AST-1001). Generate scannable QR and barcode labels to stick onto devices for instant physical lookup and audit scanning.'
    },
    {
      num: 3,
      title: 'Issue & Custody Tracking',
      icon: Users,
      color: 'bg-cyan-600',
      desc: 'Allocate in-store equipment to faculty, department leads, or lab coordinators. The asset status dynamically switches to "Assigned" with a permanent handover log. When returned, record handover condition to hold custodians accountable.'
    },
    {
      num: 4,
      title: 'Automated Depreciation Amortisation',
      icon: TrendingDown,
      color: 'bg-emerald-600',
      desc: 'The integrated depreciation engine computes monthly straight-line and written-down values (WDV). Never drop below salvage values, keep balance sheet net book value up to date, and prevent manual accounting errors.'
    },
    {
      num: 5,
      title: 'Preventative Maintenance & Repairs',
      icon: Wrench,
      color: 'bg-amber-500',
      desc: 'Log routine oil changes, calibration, lens servicing, and unexpected breakdowns. Assets under repair are marked "In Maintenance" to prevent accidental re-assignment until certified resolved by technicians.'
    },
    {
      num: 6,
      title: 'Physical Audit & End-of-Life Disposal',
      icon: Trash2,
      color: 'bg-rose-600',
      desc: 'Conduct annual physical verification sessions to match on-floor hardware with database registers. When an asset reaches its economic end-of-life, record an authorized disposal with salvage scrap proceeds and loss calculations.'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column: Step-by-step lifecycle */}
      <div className="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">The Fixed Asset Lifecycle Standard</h2>
            <p className="text-xs text-slate-500">From procurement to retirement — step-by-step institutional protocol</p>
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.num} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50/60 transition-colors border border-transparent hover:border-slate-100">
                <div className={`w-10 h-10 rounded-xl ${st.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">STAGE {st.num}</span>
                    <span className="text-slate-300">·</span>
                    <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column: Best practices & Tips */}
      <div className="lg:col-span-4 space-y-5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Compliance & Safeguards</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
              <span><strong>Immutable Audit Trail:</strong> Every handover, return, and repair is permanently logged with timestamps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
              <span><strong>Locked Status:</strong> Assets marked "Disposed" or "In Maintenance" cannot be erroneously re-issued to staff.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
              <span><strong>Statutory Valuation:</strong> Straight-Line and WDV conform to Ministry of Corporate Affairs and CBIC guidelines.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-5 text-white shadow-lg shadow-indigo-900/10">
          <div className="flex items-center gap-2 text-indigo-200 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Asset Tip</span>
          </div>
          <h4 className="text-sm font-bold">Physical Tag QR Lookups</h4>
          <p className="text-xs text-indigo-200 mt-1.5 leading-relaxed">
            Generate and print waterproof polyester QR barcode labels for all high-value IT equipment and lab apparatus to speed up annual physical verification audits by over 80%.
          </p>
        </div>
      </div>
    </div>
  );
}
