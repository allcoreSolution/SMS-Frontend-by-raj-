import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Activity, ArrowLeft, RefreshCw, Check, 
  Calendar, User, Phone, FileText, Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const HealthDashboard = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentHealth = async () => {
    try {
      setLoading(true);
      const res = await studentService.getStudentHealthProfile(id);
      if (res?.student) {
        setStudent(res.student);
        setRecords(res.records || []);
      }
    } catch (err) {
      console.error(err);
      try {
        const studentRes = await studentService.getStudentById(id);
        if (studentRes?.data) setStudent(studentRes.data);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStudentHealth();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading student clinical record...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base font-bold text-slate-800">Student not found in medical registry.</p>
        <Link to="/students/health" className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Health Records
        </Link>
      </div>
    );
  }

  const avatar = student.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + (student.lastName || ''))}&background=EEEDFF&color=5F52FF`;

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Clinical & Health Profile</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> Medical History
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete physical, clinical and allergy records for {student.firstName} {student.lastName || ''}.
          </p>
        </div>

        <Link
          to="/students/health"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Records
        </Link>
      </div>

      <StudentsTabs />

      {/* Main 2-Col Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Medical Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6 flex flex-col items-center text-center">
          <img src={avatar} alt="" className="w-24 h-24 rounded-3xl object-cover border-4 border-rose-100 shadow-md" />
          
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">{student.firstName} {student.lastName || ''}</h2>
            <p className="text-xs text-indigo-600 font-mono font-bold">{student.admissionNo || student.aparId}</p>
            <p className="text-xs text-slate-400 font-semibold">{student.classId?.className || 'Class I'} ({student.sectionId?.sectionName || 'A'}) • Roll: {student.rollNo || '-'}</p>
          </div>

          <div className="w-full space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100 text-left">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Blood Group:</span>
              <span className="font-extrabold text-rose-600">{student.bloodGroup || 'O+'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Gender & DOB:</span>
              <span className="font-semibold">{student.gender} • {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Height:</span>
              <span className="font-semibold">{student.height ? `${student.height} cm` : '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Weight:</span>
              <span className="font-semibold">{student.weight ? `${student.weight} kg` : '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Known Allergies:</span>
              <span className="font-bold text-amber-700">{student.allergies || 'None'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Parent Emergency:</span>
              <span className="font-semibold">{student.fatherPhone || student.studentPhone || '-'}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Health History Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pediatric Checkup History</h3>
              <p className="text-xs text-slate-400">Clinical assessments by school medical officers</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
              {records.length} Checkups
            </span>
          </div>

          {records.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Activity className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No prior checkup events found for this student.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div key={rec._id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900">
                        {new Date(rec.checkupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-slate-400">Examiner: {rec.doctorName || 'School Doctor'}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {rec.remarks || 'Healthy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-slate-600">
                    <div><span className="text-slate-400 block text-[10px]">Blood</span> <span className="font-bold text-rose-600">{rec.bloodGroup}</span></div>
                    <div><span className="text-slate-400 block text-[10px]">Height/Weight</span> <span className="font-semibold">{rec.height || '-'}cm / {rec.weight || '-'}kg</span></div>
                    <div><span className="text-slate-400 block text-[10px]">Vision</span> <span className="font-semibold">{rec.visionLeft || '6/6'} / {rec.visionRight || '6/6'}</span></div>
                    <div><span className="text-slate-400 block text-[10px]">Dental</span> <span className="font-semibold">{rec.dentalNotes || 'Normal'}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default HealthDashboard;
