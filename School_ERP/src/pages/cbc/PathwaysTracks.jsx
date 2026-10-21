import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, Route, Rocket, BookOpen, Users, Cpu, Palette, 
  Dumbbell, Briefcase, Plus, CheckCircle, ChevronRight, X, Sparkles, Filter 
} from 'lucide-react';
import CbcHeader from './CbcHeader';

const DEFAULT_PATHWAYS = [
  {
    id: 'path-stem',
    name: 'STEM (Science, Technology, Engineering & Math)',
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Cpu,
    studentsCount: 142,
    maxCapacity: 180,
    description: 'Fosters mathematical rigor, scientific investigation, computer programming, and physical engineering foundations.',
    tracks: [
      {
        trackName: 'Pure Sciences',
        compulsory: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Biology'],
        electives: ['Computer Science', 'Statistics', 'Geology'],
        careers: 'Medicine, Biomedical Research, Astrophysics, Chemical Engineering'
      },
      {
        trackName: 'Applied Sciences & Agriculture',
        compulsory: ['General Mathematics', 'Agricultural Science', 'Chemistry', 'Biology'],
        electives: ['Food Science', 'Environmental Studies', 'Agribusiness'],
        careers: 'Agronomy, Veterinary Medicine, Food Technology, Environmental Science'
      },
      {
        trackName: 'Technical & Engineering Studies',
        compulsory: ['Calculus', 'Physics', 'Engineering Drawing', 'Computer Studies'],
        electives: ['Aviation Tech', 'Robotics & Mechatronics', 'Electronics'],
        careers: 'Civil Engineering, Software Architecture, Aerospace, Mechatronics'
      }
    ]
  },
  {
    id: 'path-arts',
    name: 'Arts & Sports Science',
    color: 'from-amber-500 to-rose-600',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Palette,
    studentsCount: 78,
    maxCapacity: 100,
    description: 'Empowers artistic genius, theatrical expression, visual communication, and high-performance athletic kinesiology.',
    tracks: [
      {
        trackName: 'Performing Arts (Music, Dance, Drama)',
        compulsory: ['Music Theory', 'Theatre Arts', 'Literature in English'],
        electives: ['Stagecraft & Production', 'Dance Choreography', 'Vocal Performance'],
        careers: 'Music Production, Film Directing, Choreography, Playwriting'
      },
      {
        trackName: 'Visual & Applied Arts',
        compulsory: ['Fine Art', 'Graphic Design', 'Art History'],
        electives: ['Digital Animation', 'Photography', 'Sculpture & Ceramics'],
        careers: 'UI/UX Design, Creative Direction, Animation, Curatorship'
      },
      {
        trackName: 'Sports Science & Athletics',
        compulsory: ['Physical Education', 'Human Physiology', 'Sports Nutrition'],
        electives: ['Sports Management', 'Athletic Coaching', 'Kinesiology'],
        careers: 'Sports Physiotherapy, Professional Athletics, Fitness Direction, Sports Journalism'
      }
    ]
  },
  {
    id: 'path-social',
    name: 'Social Sciences & Humanities',
    color: 'from-purple-600 to-indigo-700',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Briefcase,
    studentsCount: 75,
    maxCapacity: 100,
    description: 'Cultivates deep appreciation for historical jurisprudence, economic systems, international relations, and languages.',
    tracks: [
      {
        trackName: 'Business Studies & Economics',
        compulsory: ['Business Mathematics', 'Economics', 'Accounting', 'Commerce'],
        electives: ['Entrepreneurship', 'Banking & Finance', 'Digital Marketing'],
        careers: 'Investment Banking, Corporate Law, Chartered Accountancy, Management'
      },
      {
        trackName: 'Humanities & Global Affairs',
        compulsory: ['History & International Relations', 'Geography', 'Government & Politics'],
        electives: ['Sociology', 'Psychology', 'Philosophy & Ethics'],
        careers: 'Diplomacy, Public Administration, Journalism, Human Rights Law'
      },
      {
        trackName: 'Languages & Literature',
        compulsory: ['Advanced English Literature', 'French / German', 'Linguistics'],
        electives: ['Creative Writing', 'Translation & Interpretation', 'Journalism'],
        careers: 'Foreign Service, Publishing, Computational Linguistics, Media'
      }
    ]
  }
];

const PathwaysTracks = () => {
  const navigate = useNavigate();
  const [pathways, setPathways] = useState(() => {
    const saved = localStorage.getItem('cbc_pathways');
    return saved ? JSON.parse(saved) : DEFAULT_PATHWAYS;
  });

  const [activePathwayId, setActivePathwayId] = useState('path-stem');
  const [viewTab, setViewTab] = useState('tracks'); // 'tracks' | 'allocation'
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);

  const [newTrack, setNewTrack] = useState({
    trackName: '',
    compulsory: '',
    electives: '',
    careers: ''
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const activePathway = pathways.find(p => p.id === activePathwayId) || pathways[0];

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!newTrack.trackName.trim()) return;

    const created = {
      trackName: newTrack.trackName.trim(),
      compulsory: newTrack.compulsory.split(',').map(s => s.trim()).filter(Boolean),
      electives: newTrack.electives.split(',').map(s => s.trim()).filter(Boolean),
      careers: newTrack.careers
    };

    const updated = pathways.map(p => {
      if (p.id === activePathwayId) {
        return { ...p, tracks: [...p.tracks, created] };
      }
      return p;
    });

    setPathways(updated);
    localStorage.setItem('cbc_pathways', JSON.stringify(updated));
    setIsAddTrackOpen(false);
    setNewTrack({ trackName: '', compulsory: '', electives: '', careers: '' });
    showToast(`Track "${created.trackName}" added to ${activePathway.name}!`);
  };

  const totalSeniorStudents = pathways.reduce((acc, p) => acc + p.studentsCount, 0);

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <CbcHeader activeTab="pathways" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center shadow-inner shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Senior School Educational Pathways (Grades 10 - 12)</h2>
              <p className="text-xs text-purple-200 font-medium mt-0.5">
                Students choose specialized tracks aligned with their cognitive passions and future tertiary career goals.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-white">{totalSeniorStudents}</div>
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Senior Learners Enrolled</div>
          </div>
        </div>

        {/* 3 Pathway Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pathways.map((path) => {
            const Icon = path.icon || Route;
            const isSelected = activePathwayId === path.id;
            const capacityPct = Math.round((path.studentsCount / path.maxCapacity) * 100);

            return (
              <div
                key={path.id}
                onClick={() => setActivePathwayId(path.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${path.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {path.tracks.length} Specialized Tracks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-850 mb-1.5 leading-snug">
                    {path.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mb-4 leading-relaxed line-clamp-2">
                    {path.description}
                  </p>
                </div>

                {/* Capacity Meter */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>Enrolled: {path.studentsCount} Students</span>
                    <span className="text-purple-700">{capacityPct}% Full</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${path.color} transition-all duration-500`}
                      style={{ width: `${capacityPct}%` }}
                    ></div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-purple-600 rounded-bl-lg"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Pathway Track Detail Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                <Route className="w-4 h-4 text-purple-600" />
                Tracks in {activePathway.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Core subject requirements, elective slots, and vocational outcomes
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddTrackOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Specialized Track
            </button>
          </div>

          <div className="p-6 space-y-5">
            {activePathway.tracks.map((track, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-purple-200 bg-white shadow-2xs space-y-3.5 transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {track.trackName}
                    </h4>
                    {track.careers && (
                      <p className="text-xs text-purple-700 font-semibold mt-1 pl-8">
                        🎯 Target Careers: {track.careers}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                      Compulsory Core Subjects ({track.compulsory.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {track.compulsory.map((sub, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                      Approved Electives ({track.electives.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {track.electives.map((ele, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                          {ele}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal: Add Track */}
      {isAddTrackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-purple-600 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Track to {activePathway.name}
              </h3>
              <button 
                type="button"
                onClick={() => setIsAddTrackOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTrack} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Track Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Biomedical & Health Sciences"
                  value={newTrack.trackName}
                  onChange={(e) => setNewTrack(prev => ({ ...prev, trackName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Compulsory Subjects (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Biology, Chemistry, Mathematics, Health Studies"
                  value={newTrack.compulsory}
                  onChange={(e) => setNewTrack(prev => ({ ...prev, compulsory: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Approved Electives (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Nutrition, Psychology, Bio-statistics"
                  value={newTrack.electives}
                  onChange={(e) => setNewTrack(prev => ({ ...prev, electives: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Careers</label>
                <input
                  type="text"
                  placeholder="e.g. Nursing, Pharmacy, Public Health"
                  value={newTrack.careers}
                  onChange={(e) => setNewTrack(prev => ({ ...prev, careers: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTrackOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-sm"
                >
                  Add Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PathwaysTracks;
