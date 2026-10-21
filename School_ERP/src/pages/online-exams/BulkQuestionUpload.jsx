import React, { useState } from 'react';
import { 
  Upload, Download, CheckCircle2, FileText, 
  ArrowLeft, AlertCircle, RefreshCw, Layers, CheckCircle, 
  Table, HelpCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OnlineExamsTabs from '../../components/assessment/OnlineExamsTabs';
import { onlineExamService } from '../../api/onlineExamService';

export default function BulkQuestionUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isDraft, setIsDraft] = useState(false);

  // Template download handler
  const handleDownloadTemplate = () => {
    const csvContent = 
`question_type,class_name,subject_name,question_text,option1,option2,option3,option4,correct_option,marks,difficulty,explanation
Multiple Choice - Single Answer,Class 10,Science,What is the chemical symbol for Gold?,Au,Ag,Fe,Cu,A,1,Easy,Au is from Latin Aurum.
Multiple Choice - Single Answer,Class 10,Science,Which organelle is the powerhouse of the cell?,Nucleus,Mitochondria,Ribosome,Chloroplast,B,1,Easy,Mitochondria produces ATP.
True / False,Class 10,Science,Light travels faster in air than in water.,True,False,,,A,1,Medium,Light slows down in denser medium.
Multiple Choice - Single Answer,Class 10,Mathematics,What is the square root of 144?,10,12,14,16,B,1,Easy,12 x 12 = 144.`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'online_exam_questions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV parsing function
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      // Split respecting commas inside quotes if any, or standard split
      const row = lines[i].split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1'));
      if (row.length < 4) continue;

      const qType = row[0] || 'Multiple Choice - Single Answer';
      const cName = row[1] || 'Class 10';
      const sName = row[2] || 'Science';
      const qText = row[3] || '';
      const opt1 = row[4] || '';
      const opt2 = row[5] || '';
      const opt3 = row[6] || '';
      const opt4 = row[7] || '';
      const correctChar = (row[8] || 'A').toUpperCase();
      const marksVal = Number(row[9]) || 1;
      const diffVal = row[10] || 'Medium';
      const explVal = row[11] || '';

      if (!qText) continue;

      const options = [opt1, opt2, opt3, opt4].filter(Boolean);
      let correctIndex = 0;
      if (correctChar === 'B') correctIndex = 1;
      else if (correctChar === 'C') correctIndex = 2;
      else if (correctChar === 'D') correctIndex = 3;

      questions.push({
        text: qText,
        questionType: qType,
        className: cName,
        subjectName: sName,
        options: options.length > 0 ? options : ['Option A', 'Option B'],
        correctOptionIndex: correctIndex,
        marks: marksVal,
        difficultyLevel: ['Easy', 'Medium', 'Hard'].includes(diffVal) ? diffVal : 'Medium',
        explanation: explVal,
        status: isDraft ? 'Draft' : 'Published'
      });
    }

    return questions;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'No Questions Found',
            text: 'Could not parse questions. Please make sure file matches the CSV template format.'
          });
        } else {
          setParsedQuestions(parsed);
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Parsing Error',
          text: 'Failed to read file: ' + err.message
        });
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleProcessUpload = async () => {
    if (parsedQuestions.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'Please select a valid CSV file with questions first.'
      });
      return;
    }

    try {
      setUploading(true);
      const res = await onlineExamService.bulkUploadQuestions(parsedQuestions);
      const count = res?.count || parsedQuestions.length;

      await Swal.fire({
        icon: 'success',
        title: 'Bulk Import Successful!',
        text: `Successfully imported ${count} questions into the live database.`,
        confirmButtonColor: '#7c3aed',
        confirmButtonText: 'Go to Question Bank'
      });

      navigate('/online-exams/question-bank');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Bulk Upload Failed',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  Bulk Question Upload
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Import multiple questions in batch via CSV with automatic validation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-purple-200/60"
            >
              <Download className="w-4 h-4" /> Download Sample CSV
            </button>
            <button 
              onClick={() => navigate('/online-exams/question-bank')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Question Bank
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <OnlineExamsTabs />

        {/* File Upload Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-purple-600" /> 1. Select CSV Question File
            </h3>
            <p className="text-xs text-slate-500">
              Upload your formatted CSV file containing questions, options, answer keys, and difficulty levels.
            </p>
          </div>

          <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 rounded-2xl p-8 text-center transition-all">
            <input 
              type="file" 
              id="csvInput"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden" 
            />
            <label htmlFor="csvInput" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-purple-600 border border-purple-100">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <span className="text-sm font-bold text-purple-700 block">
                  {file ? file.name : 'Click to select CSV File or drag and drop'}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'Supports standard .csv format with headers'}
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input 
              type="checkbox" 
              id="draftCheck"
              checked={isDraft}
              onChange={(e) => setIsDraft(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
            />
            <label htmlFor="draftCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Import as Drafts for review (do not immediately publish to exams)
            </label>
          </div>

          {/* Parsed Preview Table */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Preview Parsed Questions ({parsedQuestions.length} Found)
                  </span>
                </div>
                <button 
                  onClick={() => { setParsedQuestions([]); setFile(null); }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 text-[10px] font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="p-2.5 text-center w-8">#</th>
                      <th className="p-2.5">Question Text</th>
                      <th className="p-2.5">Class & Subject</th>
                      <th className="p-2.5">Options</th>
                      <th className="p-2.5 text-center">Correct</th>
                      <th className="p-2.5 text-center">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedQuestions.map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-800 max-w-xs truncate">{q.text}</td>
                        <td className="p-2.5 text-slate-600">{q.className} • {q.subjectName}</td>
                        <td className="p-2.5 text-slate-500 text-[11px] max-w-xs truncate">
                          {q.options?.join(', ')}
                        </td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">
                          {String.fromCharCode(65 + q.correctOptionIndex)}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                            {q.difficultyLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => navigate('/online-exams/question-bank')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessUpload}
              disabled={uploading || parsedQuestions.length === 0}
              className="px-7 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Importing...' : `Import ${parsedQuestions.length} Questions`}</span>
            </button>
          </div>
        </div>

        {/* Instructions Guide */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>CSV Column Specification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-700 block">Required Columns:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li><code className="text-purple-600 font-mono">question_type</code>: Multiple Choice - Single Answer, True / False, etc.</li>
                <li><code className="text-purple-600 font-mono">class_name</code>: e.g. Class 10, Class 9</li>
                <li><code className="text-purple-600 font-mono">subject_name</code>: e.g. Science, Mathematics</li>
                <li><code className="text-purple-600 font-mono">question_text</code>: The full question statement</li>
                <li><code className="text-purple-600 font-mono">correct_option</code>: A, B, C, or D</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-700 block">Optional Columns:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li><code className="text-purple-600 font-mono">option1, option2, option3, option4</code>: Distractor options</li>
                <li><code className="text-purple-600 font-mono">marks</code>: Integer marks (Default: 1)</li>
                <li><code className="text-purple-600 font-mono">difficulty</code>: Easy, Medium, or Hard</li>
                <li><code className="text-purple-600 font-mono">explanation</code>: Rationale shown after submission</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
