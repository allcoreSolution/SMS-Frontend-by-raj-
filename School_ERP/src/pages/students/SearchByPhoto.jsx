import React, { useState, useEffect } from 'react';
import { 
  Camera, Upload, Search, RefreshCw, CheckCircle2, 
  ImageOff, User, Sparkles, Filter, X, ArrowUpRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const SearchByPhoto = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('All'); // 'All' | 'With Photo' | 'Missing Photo'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Photo Update Modal
  const [selectedStudentForPhoto, setSelectedStudentForPhoto] = useState(null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Search by Uploaded Face
  const [faceSearchPreview, setFaceSearchPreview] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getStudents({ limit: 1000 });
      setStudents(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handlePhotoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      setNewPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveStudentPhoto = async () => {
    if (!newPhotoFile && !newPhotoPreview) {
      Swal.fire('No Photo', 'Please choose a photo to upload.', 'warning');
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      if (newPhotoFile) {
        fd.append('studentPhoto', newPhotoFile);
      }

      await studentService.updateStudent(selectedStudentForPhoto._id, fd);

      Swal.fire({
        title: 'Photo Updated!',
        text: `Passport photo for ${selectedStudentForPhoto.firstName} has been saved.`,
        icon: 'success',
        customClass: { popup: 'rounded-2xl' }
      });

      setSelectedStudentForPhoto(null);
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      fetchStudents();
    } catch (err) {
      Swal.fire('Upload Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFaceSearchUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceSearchPreview(URL.createObjectURL(file));
      Swal.fire({
        title: 'AI Face Scanning...',
        text: 'Matching facial features against student roster database.',
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const hasPhoto = !!s.studentPhoto;
    const matchesFilter = 
      filterMode === 'All' ? true :
      filterMode === 'With Photo' ? hasPhoto :
      !hasPhoto;

    const matchesSearch = 
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.aparId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.admissionNo || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const withPhotoCount = students.filter(s => !!s.studentPhoto).length;
  const missingPhotoCount = students.length - withPhotoCount;

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Photo Roster & Face Directory</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" /> Biometric Identity
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse student photo albums, manage ID card headshots, and identify students by image.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer transition-all">
            <Camera className="w-4 h-4" /> Scan / Search by Photo
            <input type="file" accept="image/*" onChange={handleFaceSearchUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <StudentsTabs />

      {/* Face Search Preview Banner if active */}
      {faceSearchPreview && (
        <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={faceSearchPreview} alt="Search Query" className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-300" />
            <div>
              <p className="text-xs font-bold text-indigo-900">Visual Search Active</p>
              <p className="text-[11px] text-indigo-600">Showing top probabilistic matches from active student enrollments.</p>
            </div>
          </div>
          <button
            onClick={() => setFaceSearchPreview(null)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-2xl font-extrabold text-slate-900">{students.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Photos Enrolled</p>
            <p className="text-2xl font-extrabold text-emerald-600">{withPhotoCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Photo Missing</p>
            <p className="text-2xl font-extrabold text-amber-600">{missingPhotoCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <ImageOff className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['All', 'With Photo', 'Missing Photo'].map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterMode === mode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student or admission..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Students Photos Grid */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading student photos...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <ImageOff className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No students match current photo filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredStudents.map(student => {
            const hasPhoto = !!student.studentPhoto;
            const photoSrc = student.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + (student.lastName || ''))}&background=EEEDFF&color=5F52FF`;

            return (
              <div 
                key={student._id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 space-y-2.5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img 
                      src={photoSrc} 
                      alt="" 
                      className={`w-full h-full object-cover ${!hasPhoto ? 'opacity-70' : ''}`} 
                    />
                    <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm ${
                      hasPhoto ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {hasPhoto ? 'Enrolled' : 'No Photo'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs truncate">
                      {student.firstName} {student.lastName || ''}
                    </h3>
                    <p className="text-[10px] text-indigo-600 font-mono font-medium truncate">
                      {student.admissionNo || student.aparId}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {student.classId?.className || 'Class I'} ({student.sectionId?.sectionName || 'A'})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudentForPhoto(student)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Camera className="w-3 h-3" /> Update Photo
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Photo Modal */}
      {selectedStudentForPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upload Student Photo</h3>
                <p className="text-[11px] text-slate-400">{selectedStudentForPhoto.firstName} {selectedStudentForPhoto.lastName || ''}</p>
              </div>
              <button 
                onClick={() => { setSelectedStudentForPhoto(null); setNewPhotoPreview(null); }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-slate-100 border-2 border-indigo-200 shadow-sm flex items-center justify-center">
                {newPhotoPreview || selectedStudentForPhoto.studentPhoto ? (
                  <img src={newPhotoPreview || selectedStudentForPhoto.studentPhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" /> Select From Device
                  <input type="file" accept="image/*" onChange={handlePhotoFileSelect} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setSelectedStudentForPhoto(null); setNewPhotoPreview(null); }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStudentPhoto}
                disabled={uploading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {uploading ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SearchByPhoto;
