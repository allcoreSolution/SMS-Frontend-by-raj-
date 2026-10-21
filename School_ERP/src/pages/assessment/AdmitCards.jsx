import React, { useState, useEffect } from 'react';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  Printer, Search, Filter, ShieldCheck, Download, 
  Calendar, Clock, User, QrCode, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';

export default function AdmitCards() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      examService.getExams(),
      academicService.getClasses()
    ]).then(([examsRes, classesRes]) => {
      const eList = examsRes.data || [];
      const cList = classesRes.data || [];
      setExams(eList);
      setClasses(cList);
      if (eList.length > 0) setSelectedExam(eList[0]._id);
      if (cList.length > 0) setSelectedClass(cList[0]._id);
    }).catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!selectedExam || !selectedClass) {
      return Swal.fire('Error', 'Please select both Exam and Class', 'warning');
    }

    setLoading(true);
    setLoaded(true);
    try {
      const res = await examService.getAdmitCards({
        examId: selectedExam,
        classId: selectedClass
      });
      if (res.success) {
        setCards(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load admit cards:', err);
      Swal.fire('Error', 'Failed to generate admit cards', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0 print:hidden">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Bulk Admit Cards Generator</h1>
            <p className="text-xs text-slate-500 mt-1">
              Generate and print official exam hall tickets with timetable & signature verification
            </p>
          </div>
          {loaded && cards.length > 0 && (
            <button 
              onClick={() => window.print()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print All ({cards.length}) Admit Cards
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm print:hidden">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4">
            Select Examination Criteria
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Examination *</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {exams.map(e => <option key={e._id} value={e._id}>{e.examName} ({e.session})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer h-[38px] shadow-sm"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate Hall Tickets'}
              </button>
            </div>
          </div>
        </div>

        {/* Admit Cards Roster */}
        {loaded && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-3 bg-white rounded-2xl border border-slate-200/80">
                <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-xs font-medium">Generating student hall tickets...</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No Students Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No active students enrolled in this class to generate admit cards for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-10">
                {cards.map((card, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm relative overflow-hidden space-y-4 print:border-black print:rounded-none print:break-inside-avoid"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                          ALL CORE SOLUTION
                        </span>
                        <h3 className="text-sm font-bold text-slate-800">OFFICIAL ADMIT CARD</h3>
                        <p className="text-[11px] text-slate-500 font-semibold">{card.examName} ({card.session})</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">HALL TICKET NO</span>
                        <span className="text-xs font-mono font-black text-indigo-700">{card.admitCardNo}</span>
                      </div>
                    </div>

                    {/* Student Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">{card.studentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Class & Section</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">{card.class} - {card.section}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Roll Number</span>
                        <span className="font-mono font-bold text-indigo-600 text-xs mt-0.5 block">{card.rollNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Admission Number</span>
                        <span className="font-mono text-slate-700 text-xs mt-0.5 block">{card.admissionNo}</span>
                      </div>
                    </div>

                    {/* Paper Timetable */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Scheduled Papers</span>
                      {card.timetable.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-slate-100 text-slate-600 font-bold">
                              <tr>
                                <th className="p-2">Date</th>
                                <th className="p-2">Subject</th>
                                <th className="p-2">Timing</th>
                                <th className="p-2">Room</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {card.timetable.map((t, tIdx) => (
                                <tr key={tIdx}>
                                  <td className="p-2 font-medium">{t.date}</td>
                                  <td className="p-2 font-bold text-slate-800">{t.subject}</td>
                                  <td className="p-2 font-mono">{t.time}</td>
                                  <td className="p-2">{t.room}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No specific datesheet timetable published yet.</p>
                      )}
                    </div>

                    {/* Footer Signatures */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-end text-[10px] text-slate-500">
                      <div className="text-center">
                        <div className="w-24 border-b border-slate-300 mb-1"></div>
                        Candidate Signature
                      </div>
                      <div className="text-center font-mono text-[9px] text-slate-400">
                        ||| |||| || | ||||
                      </div>
                      <div className="text-center">
                        <div className="w-24 border-b border-slate-300 mb-1"></div>
                        Principal / Controller
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
