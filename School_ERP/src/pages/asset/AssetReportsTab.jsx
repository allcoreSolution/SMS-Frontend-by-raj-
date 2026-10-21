import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Eye,
  TrendingDown,
  Users,
  Wrench,
  Shield,
  RotateCcw,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AssetReportsTab({
  assets = [],
  categories = [],
  allocations = [],
  maintenances = [],
  disposals = []
}) {
  const downloadReportCSV = (reportKey, title) => {
    let headers = [];
    let rows = [];

    if (reportKey === 'register') {
      headers = ['Asset Code', 'Asset Name', 'Category', 'Location', 'Cost (INR)', 'Current Value (INR)', 'Status'];
      rows = assets.map(a => [
        a.assetCode,
        `"${(a.assetName || '').replace(/"/g, '""')}"`,
        `"${a.category || ''}"`,
        `"${a.location || ''}"`,
        a.cost || 0,
        a.currentValue || a.cost || 0,
        a.status || ''
      ]);
    } else if (reportKey === 'depreciation') {
      headers = ['Asset Code', 'Asset Name', 'Category', 'Acquisition Cost', 'Accumulated Dep.', 'Net Book Value'];
      rows = assets.map(a => {
        const cost = a.cost || 0;
        const val = a.currentValue || cost;
        return [
          a.assetCode,
          `"${(a.assetName || '').replace(/"/g, '""')}"`,
          `"${a.category || ''}"`,
          cost,
          Math.max(0, cost - val),
          val
        ];
      });
    } else if (reportKey === 'custody') {
      headers = ['Asset Code', 'Asset Name', 'Staff Holder', 'Department', 'Issue Date', 'Expected Return', 'Status'];
      rows = allocations.map(al => [
        al.assetCode,
        `"${(al.assetName || '').replace(/"/g, '""')}"`,
        `"${al.staffName || ''}"`,
        `"${al.department || ''}"`,
        al.issueDate ? new Date(al.issueDate).toLocaleDateString() : '',
        al.expectedReturnDate ? new Date(al.expectedReturnDate).toLocaleDateString() : '',
        al.status || ''
      ]);
    } else if (reportKey === 'maintenance') {
      headers = ['Asset Code', 'Asset Name', 'Service Type', 'Vendor / Technician', 'Cost (INR)', 'Status'];
      rows = maintenances.map(m => [
        m.assetCode,
        `"${(m.assetName || '').replace(/"/g, '""')}"`,
        `"${m.maintenanceType || ''}"`,
        `"${m.technician || m.vendor || ''}"`,
        m.cost || 0,
        m.status || ''
      ]);
    } else if (reportKey === 'disposal') {
      headers = ['Asset Code', 'Asset Name', 'Method', 'Original Cost', 'Sale Value', 'Gain / Loss', 'Approved By'];
      rows = disposals.map(d => [
        d.assetCode,
        `"${(d.assetName || '').replace(/"/g, '""')}"`,
        d.disposalMethod || 'Scrapped',
        d.originalCost || 0,
        d.saleValue || 0,
        (d.saleValue || 0) - (d.originalCost || 0),
        `"${d.approvedBy || ''}"`
      ]);
    }

    if (rows.length === 0) {
      Swal.fire('Empty Report', 'No records found to export for this report.', 'info');
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Exported ${title}`,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const reports = [
    {
      id: 'register',
      title: 'Fixed Asset Register',
      desc: 'Complete inventory list of all equipment with serial numbers, tags, location, and purchase cost.',
      icon: Package,
      count: `${assets.length} Assets`
    },
    {
      id: 'depreciation',
      title: 'Depreciation & Valuation Matrix',
      desc: 'Historical cost, accumulated straight-line & WDV depreciation, and net book balance sheet values.',
      icon: TrendingDown,
      count: 'Full Schedule'
    },
    {
      id: 'custody',
      title: 'Custody & Allocation History',
      desc: 'Audit trail of staff custody, handover condition, and returned equipment records.',
      icon: Users,
      count: `${allocations.length} Handover Logs`
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Service Expenditure',
      desc: 'Complete work order breakdown, technician vendor billing, and repair history.',
      icon: Wrench,
      count: `${maintenances.length} Work Orders`
    },
    {
      id: 'disposal',
      title: 'Asset Retirement & Disposal Ledger',
      desc: 'Written-off, scrapped, and auctioned assets with realized salvage value and gains/losses.',
      icon: RotateCcw,
      count: `${disposals.length} Retired Items`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            Statutory & Management Asset Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export audit-ready CSV spreadsheets and statutory fixed asset balance registers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {rep.count}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3">{rep.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => downloadReportCSV(rep.id, rep.title)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/20"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
