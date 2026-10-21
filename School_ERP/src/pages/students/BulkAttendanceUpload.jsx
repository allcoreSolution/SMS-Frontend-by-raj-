import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Download, Info, ArrowLeft, Check, FileSpreadsheet } from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';

const BulkAttendanceUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const downloadTemplate = () => {
    const header = "Admission No,Date (YYYY-MM-DD),Attendance Status,Remarks\n";
    const data = "YISADM-101,2026-10-13,Present,On time\nYISADM-102,2026-10-13,Absent,Sick leave\nYISADM-103,2026-10-13,Late,Bus delayed\n";
    
    const blob = new Blob([header + data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_attendance_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      Swal.fire('No File Selected', 'Please select a CSV attendance file to import.', 'warning');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      Swal.fire({
        title: 'Attendance Batch Imported!',
        text: `Processed attendance sheet: ${selectedFile.name}. All records updated in live roster.`,
        icon: 'success',
        customClass: { popup: 'rounded-2xl' }
      }).then(() => {
        navigate('/students/attendance');
      });
    }, 1200);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bulk Attendance Import</h1>
          <p className="text-xs text-slate-500 mt-1">Upload daily biometric or CSV sheet attendance batches.</p>
        </div>
        <button
          onClick={() => navigate('/students/attendance')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Daily Roster
        </button>
      </div>

      <StudentsTabs />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Upload Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Upload Attendance File</h2>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Sample CSV
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Select or drag & drop CSV attendance file'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports CSV or XLS format with columns: Admission No, Date, Status, Remarks</p>
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                Choose CSV File
                <input 
                  type="file" 
                  accept=".csv, .xlsx, .xls" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleUploadSubmit}
              disabled={uploading || !selectedFile}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {uploading ? 'Importing Batch...' : 'Import Attendance Records'}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Instructions */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Info className="w-5 h-5 text-indigo-600" /> Instructions
          </div>
          <div className="space-y-3 text-xs text-indigo-950/80 leading-relaxed">
            <p>1. Download the template CSV file to ensure correct column matching.</p>
            <p>2. Values for <strong>Attendance Status</strong> must be: <code>Present</code>, <code>Absent</code>, <code>Late</code>, or <code>Half-Day</code>.</p>
            <p>3. Dates should be in <code>YYYY-MM-DD</code> format (e.g. <code>2026-10-13</code>).</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default BulkAttendanceUpload;
