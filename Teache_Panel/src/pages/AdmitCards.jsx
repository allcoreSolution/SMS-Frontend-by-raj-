import React, { useState, useEffect } from 'react';
import { 
  Printer, Edit, Trash2, Search, RefreshCw, X, 
  CheckCircle2, AlertCircle, Settings, Plus, Eye, List, Grid, Calendar, Building
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../api/examService';
import { academicService } from '../api/academicService';

const AdmitCards = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals
  const [editingCard, setEditingCard] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Batch Generation Form State
  const [batchForm, setBatchForm] = useState({
    examCenter: 'Springdale Central Campus - Main Exam Block',
    roomNo: 'Examination Hall 1',
    instructions: '1. Carry this admit card to the examination hall daily.\n2. Arrive 30 minutes before the scheduled time.\n3. Electronic gadgets and smart watches are strictly prohibited.'
  });

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    setLoadingMeta(true);
    try {
      const [exRes, clsRes, secRes] = await Promise.all([
        examService.getExams(),
        academicService.getClasses(),
        academicService.getSections()
      ]);

      if (exRes && exRes.data) {
        setExams(exRes.data);
        if (exRes.data.length > 0) setSelectedExam(exRes.data[0]._id);
      }
      if (clsRes && clsRes.data) {
        setClasses(clsRes.data);
        if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0]._id);
      }
      if (secRes && secRes.data) setSections(secRes.data);
    } catch (err) {
      console.error('Error loading metadata:', err);
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleFetchCards = async () => {
    if (!selectedExam || !selectedClass) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Criteria',
        text: 'Please select both Exam and Class to generate or view admit cards.'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await examService.getAdmitCards({
        examId: selectedExam,
        classId: selectedClass
      });
      if (res && res.data) {
        setCards(res.data);
      }
    } catch (err) {
      console.error('Error fetching admit cards:', err);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed',
        text: 'Could not load admit cards from database.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Card Modal
  const handleOpenEdit = (card) => {
    setEditingCard(JSON.parse(JSON.stringify(card)));
  };

  // Timetable row changes in editing card
  const handleTimetableChange = (index, field, value) => {
    setEditingCard(prev => {
      const newTt = [...prev.timetable];
      newTt[index][field] = value;
      return { ...prev, timetable: newTt };
    });
  };

  const handleAddTimetableRow = () => {
    setEditingCard(prev => ({
      ...prev,
      timetable: [
        ...prev.timetable,
        {
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          subject: 'New Subject',
          subjectCode: 'SUB',
          time: '09:30 AM - 12:30 PM',
          room: prev.roomNo || 'Hall 1'
        }
      ]
    }));
  };

  const handleRemoveTimetableRow = (index) => {
    setEditingCard(prev => ({
      ...prev,
      timetable: prev.timetable.filter((_, i) => i !== index)
    }));
  };

  // Save edited admit card
  const handleSaveCardEdit = async (e) => {
    e.preventDefault();
    if (!editingCard) return;

    try {
      const res = await examService.updateAdmitCard(editingCard._id, editingCard);
      if (res.success || res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Admit Card Updated',
          text: `Hall ticket details for ${editingCard.studentName} updated successfully!`,
          timer: 2000,
          showConfirmButton: false
        });

        setCards(prev => prev.map(c => c._id === editingCard._id ? res.data : c));
        setEditingCard(null);
      }
    } catch (err) {
      console.error('Error saving admit card:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Could not save admit card changes.'
      });
    }
  };

  // Batch regenerate
  const handleBatchGenerate = async (e) => {
    e.preventDefault();
    if (!selectedExam || !selectedClass) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Criteria First',
        text: 'Please select Exam and Class from the top filter bar.'
      });
      return;
    }

    try {
      const payload = {
        examId: selectedExam,
        classId: selectedClass,
        examCenter: batchForm.examCenter,
        roomNo: batchForm.roomNo,
        instructions: batchForm.instructions
      };

      const res = await examService.generateAdmitCardsBatch(payload);
      if (res.success || res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Batch Generated!',
          text: `Generated ${res.count} fresh admit cards with updated center and instructions.`,
          timer: 2000,
          showConfirmButton: false
        });
        setCards(res.data);
        setShowBatchModal(false);
      }
    } catch (err) {
      console.error('Error generating batch admit cards:', err);
      Swal.fire({
        icon: 'error',
        title: 'Generation Failed',
        text: 'Could not generate admit cards.'
      });
    }
  };

  // Delete Admit Card
  const handleDeleteCard = async (id, name) => {
    const result = await Swal.fire({
      title: 'Remove Admit Card?',
      text: `Are you sure you want to remove the hall ticket for "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        await examService.deleteAdmitCard(id);
        setCards(prev => prev.filter(c => c._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting admit card:', err);
      }
    }
  };

  const filteredCards = cards.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      (c.studentName || '').toLowerCase().includes(q) ||
      (c.rollNo || '').toLowerCase().includes(q) ||
      (c.admitCardNo || '').toLowerCase().includes(q) ||
      (c.admissionNo || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generate & Edit Admit Cards</h1>
          <p className="text-xs text-gray-500 mt-0.5">Generate, customize roll numbers, adjust center rooms, edit paper timetables, and print hall tickets</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cards.length > 0 && (
            <>
              <button 
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded shadow-sm hover:bg-gray-50 text-xs font-semibold"
              >
                <Settings className="w-4 h-4 text-indigo-600" /> Batch Center & Instructions
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-[#ffb822] hover:bg-[#eaa411] text-white px-4 py-2 rounded shadow-sm text-xs font-bold transition-all"
              >
                <Printer className="w-4 h-4" /> Print All Tickets ({cards.length})
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Selection Bar */}
        <div className="bg-white rounded border border-gray-200 shadow-sm p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Select Exam <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Choose Exam --</option>
                {exams.map(e => (
                  <option key={e._id} value={e._id}>{e.examName || e.name} ({e.session})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Choose Class --</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Section</label>
              <select 
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">All Sections</option>
                {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
              </select>
            </div>

            <div>
              <button 
                onClick={handleFetchCards}
                disabled={loading}
                className="w-full bg-[#5d78ff] hover:bg-[#4b65e6] text-white font-bold px-4 py-2 rounded text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 h-[35px]"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Search className="w-3.5 h-3.5"/>}
                {loading ? 'Generating...' : 'Generate & Fetch Admit Cards'}
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar & Cards Display */}
        {cards.length > 0 && (
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-[#f8f9fe]">
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-800 text-sm">
                  Hall Tickets Generated ({filteredCards.length})
                </span>
                <div className="flex bg-gray-100 rounded p-0.5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search student, roll, ticket no..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-xs w-64 focus:outline-none focus:border-blue-400"
                />
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Content Display */}
            {viewMode === 'grid' ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50">
                {filteredCards.map(card => (
                  <div key={card._id} className="bg-white border-2 border-indigo-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="font-extrabold text-indigo-950 text-sm">{card.studentName}</h4>
                        <span className="text-[11px] text-gray-500 font-semibold">
                          Roll: {card.rollNo} • Adm: {card.admissionNo}
                        </span>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                        {card.admitCardNo}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs my-3 bg-gray-50/70 p-2.5 rounded">
                      <p><strong className="text-gray-600">Class & Section:</strong> {card.className} - {card.sectionName}</p>
                      <p><strong className="text-gray-600">Center:</strong> {card.examCenter}</p>
                      <p><strong className="text-gray-600">Room / Hall:</strong> {card.roomNo}</p>
                      <p><strong className="text-gray-600">Papers:</strong> {card.timetable?.length || 0} scheduled</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {card.status || 'Generated'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setPreviewCard(card)}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold flex items-center gap-1"
                          title="Preview Ticket"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(card)}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold flex items-center gap-1"
                          title="Edit Card Details"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteCard(card._id, card.studentName)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Ticket No</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Student Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Roll No</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Center & Room</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map(card => (
                    <tr key={card._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 text-xs font-mono font-bold text-indigo-700">{card.admitCardNo}</td>
                      <td className="px-6 py-3 font-semibold text-gray-800">{card.studentName}</td>
                      <td className="px-6 py-3 text-xs font-bold">{card.rollNo}</td>
                      <td className="px-6 py-3 text-xs text-gray-600">{card.examCenter} • {card.roomNo}</td>
                      <td className="px-6 py-3">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {card.status || 'Generated'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setPreviewCard(card)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4"/></button>
                          <button onClick={() => handleOpenEdit(card)} className="p-1 text-amber-600 hover:bg-amber-50 rounded"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => handleDeleteCard(card._id, card.studentName)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ===== EDIT ADMIT CARD MODAL ===== */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditingCard(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-amber-50/50">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-800 text-sm">
                  Edit Admit Card: <span className="text-indigo-700">{editingCard.studentName}</span>
                </h3>
              </div>
              <button onClick={() => setEditingCard(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSaveCardEdit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Basic Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Admit Card No</label>
                  <input 
                    type="text" 
                    value={editingCard.admitCardNo}
                    onChange={e => setEditingCard({...editingCard, admitCardNo: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Roll Number</label>
                  <input 
                    type="text" 
                    value={editingCard.rollNo}
                    onChange={e => setEditingCard({...editingCard, rollNo: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Admission Number</label>
                  <input 
                    type="text" 
                    value={editingCard.admissionNo}
                    onChange={e => setEditingCard({...editingCard, admissionNo: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              {/* Center & Room Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exam Center / Venue</label>
                  <input 
                    type="text" 
                    value={editingCard.examCenter}
                    onChange={e => setEditingCard({...editingCard, examCenter: e.target.value})}
                    placeholder="e.g. Campus Examination Wing A"
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Room / Hall Number</label>
                  <input 
                    type="text" 
                    value={editingCard.roomNo}
                    onChange={e => setEditingCard({...editingCard, roomNo: e.target.value})}
                    placeholder="e.g. Hall 1, Room 204"
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              {/* Timetable Papers Customizer */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-extrabold text-indigo-900 uppercase">Examination Datesheet / Timetable</h4>
                  <button 
                    type="button" 
                    onClick={handleAddTimetableRow}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Paper
                  </button>
                </div>

                <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  {editingCard.timetable && editingCard.timetable.map((tt, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-gray-200">
                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-400 font-bold uppercase block">Date</label>
                        <input 
                          type="text" 
                          value={tt.date}
                          onChange={e => handleTimetableChange(idx, 'date', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                          placeholder="e.g. 15 Oct 2026"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-400 font-bold uppercase block">Subject Name</label>
                        <input 
                          type="text" 
                          value={tt.subject}
                          onChange={e => handleTimetableChange(idx, 'subject', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-semibold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-400 font-bold uppercase block">Exam Timing</label>
                        <input 
                          type="text" 
                          value={tt.time}
                          onChange={e => handleTimetableChange(idx, 'time', e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="col-span-2 flex items-end justify-end">
                        <button 
                          type="button"
                          onClick={() => handleRemoveTimetableRow(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hall Ticket Instructions</label>
                <textarea 
                  rows={3}
                  value={editingCard.instructions}
                  onChange={e => setEditingCard({...editingCard, instructions: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#5d78ff] hover:bg-[#4b65e6] text-white rounded text-xs font-bold shadow-sm"
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== FULL PRINTABLE PREVIEW MODAL ===== */}
      {previewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreviewCard(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:hidden">
              <h3 className="font-bold text-gray-800 text-sm">Printable Admit Card</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Ticket
                </button>
                <button onClick={() => setPreviewCard(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="border-2 border-indigo-900 rounded-lg p-5">
                <div className="border-b-2 border-indigo-900 pb-3 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black text-indigo-950">SPRINGDALE CENTRAL ACADEMY</h2>
                    <p className="text-xs text-gray-600 font-semibold">{previewCard.examName} • {previewCard.session}</p>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">Venue: {previewCard.examCenter}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-indigo-900 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                      HALL TICKET
                    </span>
                    <p className="text-xs font-mono font-bold text-indigo-800 mt-1">{previewCard.admitCardNo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs my-4 bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Candidate Name</span>
                    <p className="font-bold text-gray-900 text-sm">{previewCard.studentName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Roll Number</span>
                    <p className="font-bold text-gray-900 text-sm">{previewCard.rollNo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Class & Section</span>
                    <p className="font-bold text-gray-900">{previewCard.className} - {previewCard.sectionName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Room / Hall</span>
                    <p className="font-bold text-indigo-700">{previewCard.roomNo}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase mb-1">Paper Schedule</h4>
                  <table className="w-full text-left border border-gray-200 text-xs">
                    <thead>
                      <tr className="bg-indigo-900 text-white">
                        <th className="p-1.5 border border-indigo-900">Date</th>
                        <th className="p-1.5 border border-indigo-900">Subject</th>
                        <th className="p-1.5 border border-indigo-900">Time</th>
                        <th className="p-1.5 border border-indigo-900">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewCard.timetable && previewCard.timetable.map((t, idx) => (
                        <tr key={idx} className="border-b border-gray-200 even:bg-gray-50">
                          <td className="p-1.5 font-medium">{t.date}</td>
                          <td className="p-1.5 font-bold text-indigo-900">{t.subject}</td>
                          <td className="p-1.5 text-gray-600">{t.time}</td>
                          <td className="p-1.5 font-mono">{t.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 text-[10px] text-gray-500 whitespace-pre-line">
                  <p className="font-bold text-gray-700">Important Instructions:</p>
                  {previewCard.instructions}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-end text-[10px] text-gray-600">
                  <span>Candidate Signature: ____________</span>
                  <span>Exam Controller: ____________</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end print:hidden">
              <button 
                onClick={() => setPreviewCard(null)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BATCH CUSTOMIZATION MODAL ===== */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowBatchModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-indigo-50/50">
              <h3 className="font-bold text-gray-800 text-sm">Batch Center & Instructions Customizer</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleBatchGenerate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Default Examination Venue / Center</label>
                <input 
                  type="text" 
                  value={batchForm.examCenter}
                  onChange={e => setBatchForm({...batchForm, examCenter: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Default Hall / Room Number</label>
                <input 
                  type="text" 
                  value={batchForm.roomNo}
                  onChange={e => setBatchForm({...batchForm, roomNo: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Standard Candidate Guidelines</label>
                <textarea 
                  rows={4}
                  value={batchForm.instructions}
                  onChange={e => setBatchForm({...batchForm, instructions: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm"
                >
                  Apply to Entire Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmitCards;
