import React from 'react';
import { Link } from 'react-router-dom';
import { FileBadge, Briefcase, Users, ArrowRight } from 'lucide-react';

const WidgetHeader = ({ title, icon: Icon, link }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2">
      <div className="bg-[#1e3a5f] p-1.5 rounded-none text-white">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
    {link ? (
      <Link to={link} className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </Link>
    ) : (
      <button className="text-[11px] font-bold text-[#5F52FF] flex items-center hover:underline">
        View all <ArrowRight className="w-3 h-3 ml-0.5" />
      </button>
    )}
  </div>
);

const AttendanceWidget = () => {
  const [activeTab, setActiveTab] = React.useState('Overview');

  return (
    <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
      <WidgetHeader title="Attendance" icon={FileBadge}  link="/students/attendance" />
      
      <div className="grid grid-cols-4 gap-2 mb-4 text-center">
        <div>
          <div className="text-emerald-500 font-extrabold text-lg">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Present</div>
        </div>
        <div>
          <div className="text-red-500 font-extrabold text-lg">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Absent</div>
        </div>
        <div>
          <div className="text-orange-500 font-extrabold text-lg">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Late</div>
        </div>
        <div>
          <div className="text-amber-600 font-extrabold text-lg">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Not Marked</div>
        </div>
      </div>

      <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold mt-auto">
        <button onClick={() => setActiveTab('Overview')} className={`flex-1 pb-2 ${activeTab === 'Overview' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Overview</button>
        <button onClick={() => setActiveTab('Class')} className={`flex-1 pb-2 ${activeTab === 'Class' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Class & section</button>
        <button onClick={() => setActiveTab('NotMarked')} className={`flex-1 pb-2 ${activeTab === 'NotMarked' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Not marked</button>
      </div>

      <div className="flex-1 flex flex-col justify-end min-h-[90px]">
        {activeTab === 'Overview' && (
          <>
            <div className="text-[11px] text-slate-500 mb-1">Today's attendance <span className="float-right font-bold text-slate-800">0%</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-none mb-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-none" style={{ width: '0%' }}></div>
            </div>
            <div className="text-[10px] text-slate-400 mb-4">0 of 0 students marked · 0 of 0 sections done</div>

            <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-3 py-2 rounded-none flex items-center gap-1.5 border border-amber-100">
              <div className="w-3 h-3 bg-amber-500 text-white rounded-none flex items-center justify-center text-[8px]">!</div>
              Loading section attendance data...
            </div>
          </>
        )}
        {activeTab === 'Class' && (
          <div className="flex items-center justify-center h-full text-[11px] text-slate-400 border border-dashed border-slate-200 p-2 text-center bg-slate-50">
            Class & Section wise attendance drilldown will populate here.
          </div>
        )}
        {activeTab === 'NotMarked' && (
          <div className="flex items-center justify-center h-full text-[11px] text-slate-400 border border-dashed border-slate-200 p-2 text-center bg-slate-50">
            List of pending students/sections to be marked currently empty.
          </div>
        )}
      </div>
    </div>
  );
};

const FeesFinanceWidget = () => {
  const [activeTab, setActiveTab] = React.useState('Overview');

  return (
    <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
      <WidgetHeader title="Fees & Finance" icon={Briefcase}  link="/finance/dashboard" />
      
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div>
          <div className="text-slate-800 font-extrabold text-sm">₹0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Annual Demand</div>
        </div>
        <div>
          <div className="text-emerald-500 font-extrabold text-sm">₹0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Collected</div>
        </div>
        <div>
          <div className="text-red-500 font-extrabold text-sm">₹0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Pending</div>
        </div>
      </div>

      <div className="flex border-b border-slate-100 mb-4 text-[11px] font-bold mt-auto">
        <button onClick={() => setActiveTab('Overview')} className={`flex-1 pb-2 ${activeTab === 'Overview' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Overview</button>
        <button onClick={() => setActiveTab('Recent')} className={`flex-1 pb-2 ${activeTab === 'Recent' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Recent</button>
        <button onClick={() => setActiveTab('Dues')} className={`flex-1 pb-2 ${activeTab === 'Dues' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Dues</button>
      </div>

      <div className="flex-1 flex flex-col justify-end min-h-[90px]">
        {activeTab === 'Overview' && (
          <>
            <div className="text-[11px] text-slate-500 mb-1">Collection progress <span className="float-right font-bold text-slate-800">0%</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-none mb-4 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-none" style={{ width: '0%' }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-emerald-50 rounded-none p-2 text-center border border-emerald-100">
                <div className="text-emerald-700 font-extrabold text-sm">₹0</div>
                <div className="text-[9px] font-bold text-emerald-600 uppercase">Income (This Month)</div>
              </div>
              <div className="bg-red-50 rounded-none p-2 text-center border border-red-100">
                <div className="text-slate-800 font-extrabold text-sm">₹0</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase">Expense (This Month)</div>
              </div>
            </div>
            
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-none"></div> Today's collection: ₹0
            </div>
          </>
        )}
        {activeTab === 'Recent' && (
          <div className="flex items-center justify-center h-full text-[11px] text-slate-400 border border-dashed border-slate-200 p-2 text-center bg-slate-50">
            Recent fee receipts and financial logs will populate here.
          </div>
        )}
        {activeTab === 'Dues' && (
          <div className="flex items-center justify-center h-full text-[11px] text-slate-400 border border-dashed border-slate-200 p-2 text-center bg-slate-50">
            Pending dues alert and tracking overview.
          </div>
        )}
      </div>
    </div>
  );
};

const StudentInfoWidget = () => {
  const [activeTab, setActiveTab] = React.useState('Gender');

  return (
    <div className="bg-white p-4 rounded-none shadow-sm border border-slate-200 h-full flex flex-col">
      <WidgetHeader title="Student Information" icon={Users}  link="/students/list" />
      
      <div className="grid grid-cols-4 gap-2 mb-4 text-center">
        <div>
          <div className="text-slate-800 font-extrabold text-sm">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Total</div>
        </div>
        <div>
          <div className="text-emerald-500 font-extrabold text-sm">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">New this month</div>
        </div>
        <div>
          <div className="text-slate-800 font-extrabold text-sm">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Drop-outs</div>
        </div>
        <div>
          <div className="text-orange-500 font-extrabold text-sm">0</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase">Inactive</div>
        </div>
      </div>

      <div className="flex border-b border-slate-100 mb-6 text-[11px] font-bold mt-auto">
        <button onClick={() => setActiveTab('Gender')} className={`flex-1 pb-2 ${activeTab === 'Gender' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Gender</button>
        <button onClick={() => setActiveTab('ClassGroups')} className={`flex-1 pb-2 ${activeTab === 'ClassGroups' ? 'border-b-2 border-slate-800 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Class groups</button>
      </div>

      <div className="flex-1 flex flex-col justify-end min-h-[90px]">
        {activeTab === 'Gender' && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Male 0</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden">
                <div className="bg-blue-500 h-full rounded-none" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Female 0</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden">
                <div className="bg-red-500 h-full rounded-none" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'ClassGroups' && (
          <div className="flex items-center justify-center h-full text-[11px] text-slate-400 border border-dashed border-slate-200 p-2 text-center bg-slate-50">
            Student distribution across class groups loading...
          </div>
        )}
      </div>
    </div>
  );
};

const RowOne = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <AttendanceWidget />
      <FeesFinanceWidget />
      <StudentInfoWidget />
    </div>
  );
};

export default RowOne;
