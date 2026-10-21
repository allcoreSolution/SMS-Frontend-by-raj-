import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, MessageSquare, Brain, Lightbulb, Globe, BookOpen, 
  Heart, Laptop, Plus, CheckCircle, Search, Edit3, Trash2, X, Sparkles, Filter 
} from 'lucide-react';
import CbcHeader from './CbcHeader';

const DEFAULT_COMPETENCIES = [
  {
    id: 'comp-1',
    name: 'Communication & Collaboration',
    category: 'Interpersonal',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600',
    description: 'Articulates ideas clearly across verbal and written media, actively listens to peers, and functions constructively in diverse team environments.',
    indicators: [
      'Speaks with appropriate inflection and confident posture.',
      'Constructively negotiates roles and compromises during team challenges.',
      'Active listening: Summarizes speaker arguments before responding.'
    ],
    rubrics: {
      lvl4: 'Demonstrates outstanding leadership, mediates team conflicts, and synthesizes diverse viewpoints.',
      lvl3: 'Expresses opinions respectfully and shares team workload equitably.',
      lvl2: 'Cooperates when prompted; requires guidance to resolve differences.',
      lvl1: 'Hesitates to communicate with peers or dominates team discussions inappropriately.'
    }
  },
  {
    id: 'comp-2',
    name: 'Critical Thinking & Problem Solving',
    category: 'Cognitive',
    color: 'from-teal-600 to-emerald-600',
    borderColor: 'border-teal-200',
    iconBg: 'bg-teal-50 text-teal-600',
    description: 'Analyzes information objectively, challenges unproven assumptions, evaluates evidence, and designs logical solutions to complex challenges.',
    indicators: [
      'Questions underlying premises with "Why?" and "What if?".',
      'Distinguishes between verified factual evidence and subjective bias.',
      'Breaks complex problems into sequential solvable steps.'
    ],
    rubrics: {
      lvl4: 'Autonomously identifies systemic fallacies and invents elegant novel solutions.',
      lvl3: 'Analyzes evidence accurately and identifies logical problem remedies.',
      lvl2: 'Identifies immediate symptoms but struggles with root causes.',
      lvl1: 'Accepts information uncritically and relies entirely on teacher solutions.'
    }
  },
  {
    id: 'comp-3',
    name: 'Imagination & Creativity',
    category: 'Cognitive',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
    description: 'Generates original expressions, experiments with divergent perspectives, and crafts innovative artifacts across arts and sciences.',
    indicators: [
      'Connects seemingly unrelated concepts into cohesive projects.',
      'Willing to take creative risks without fear of initial mistakes.',
      'Re-imagines existing tools for innovative alternative uses.'
    ],
    rubrics: {
      lvl4: 'Produces stunningly original work displaying exceptional imagination.',
      lvl3: 'Generates creative ideas and applies them neatly in assignments.',
      lvl2: 'Applies minor variations to existing examples with prompts.',
      lvl1: 'Strictly copies existing templates without original thought.'
    }
  },
  {
    id: 'comp-4',
    name: 'Citizenship & Global Awareness',
    category: 'Social-Emotional',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-50 text-purple-600',
    description: 'Cultivates civic responsibility, respects multi-ethnic cultural traditions, and champions ecological sustainability and community welfare.',
    indicators: [
      'Shows active stewardship of school environment and resources.',
      'Celebrates cultural diversity and champions inclusion.',
      'Follows democratic norms in classroom decision making.'
    ],
    rubrics: {
      lvl4: 'Champions school-wide community service initiatives with deep empathy.',
      lvl3: 'Demonstrates civic responsibility and respects all peers equally.',
      lvl2: 'Complies with classroom rules when supervised.',
      lvl1: 'Disregards shared resources and exhibits intolerance towards others.'
    }
  },
  {
    id: 'comp-5',
    name: 'Learning to Learn (Self-Directed Study)',
    category: 'Metacognitive',
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-200',
    iconBg: 'bg-cyan-50 text-cyan-600',
    description: 'Sets ambitious study objectives, monitors personal comprehension progress, and seeks out supplementary resources independently.',
    indicators: [
      'Identifies personal knowledge gaps and asks for targeted guidance.',
      'Organizes study schedules and sustains focus on multi-day tasks.',
      'Reflects on teacher feedback to improve subsequent submissions.'
    ],
    rubrics: {
      lvl4: 'Demonstrates exceptional metacognition, self-corrects, and mentors peers.',
      lvl3: 'Plans study goals and manages time effectively to complete projects.',
      lvl2: 'Requires regular teacher reminders to complete self-study tasks.',
      lvl1: 'Passive learner; shows no initiative beyond mandatory class hours.'
    }
  },
  {
    id: 'comp-6',
    name: 'Self-Efficacy & Resilience',
    category: 'Social-Emotional',
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
    description: 'Maintains healthy self-esteem, regulates emotions under stress, and perseveres determinedly through academic and personal setbacks.',
    indicators: [
      'Treats failure and mistakes as valuable learning iterations.',
      'Manages frustration calmly during demanding tasks.',
      'Displays confident willingness to tackle difficult subjects.'
    ],
    rubrics: {
      lvl4: 'Exhibits immense emotional maturity, optimism, and inspires others.',
      lvl3: 'Bounces back steadily from mistakes and sustains high effort.',
      lvl2: 'Becomes easily discouraged by difficulty but persists when encouraged.',
      lvl1: 'Gives up immediately when faced with non-routine challenges.'
    }
  },
  {
    id: 'comp-7',
    name: 'Digital Literacy & Cyber Safety',
    category: 'Technological',
    color: 'from-violet-600 to-indigo-600',
    borderColor: 'border-violet-200',
    iconBg: 'bg-violet-50 text-violet-600',
    description: 'Utilizes computing devices, digital learning suites, and online research repositories efficiently, ethically, and safely.',
    indicators: [
      'Evaluates online search credibility and validates digital sources.',
      'Observes digital privacy, password hygiene, and online etiquette.',
      'Uses digital spreadsheets, presentations, and coding platforms.'
    ],
    rubrics: {
      lvl4: 'Leverages advanced software to author sophisticated digital artifacts.',
      lvl3: 'Navigates online tools competently and practices responsible cyber etiquette.',
      lvl2: 'Basic device navigation; requires oversight when browsing internet.',
      lvl1: 'Cannot operate basic classroom software without constant support.'
    }
  }
];

const CoreCompetencies = () => {
  const navigate = useNavigate();
  const [competencies, setCompetencies] = useState(() => {
    const saved = localStorage.getItem('cbc_competencies');
    return saved ? JSON.parse(saved) : DEFAULT_COMPETENCIES;
  });

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState('comp-1');

  const [newComp, setNewComp] = useState({
    name: '',
    category: 'Cognitive',
    description: '',
    indicators: ''
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredCompetencies = competencies.filter(c => {
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesQuery = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleAddCompetency = (e) => {
    e.preventDefault();
    if (!newComp.name.trim()) return;

    const created = {
      id: `comp-${Date.now()}`,
      name: newComp.name.trim(),
      category: newComp.category,
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600',
      description: newComp.description,
      indicators: newComp.indicators.split('\n').filter(i => i.trim()),
      rubrics: {
        lvl4: 'Demonstrates exceptional mastery and application.',
        lvl3: 'Meets benchmark standards consistently.',
        lvl2: 'Approaches standard with occasional support.',
        lvl1: 'Below standard; requires remedial coaching.'
      }
    };

    const updated = [...competencies, created];
    setCompetencies(updated);
    localStorage.setItem('cbc_competencies', JSON.stringify(updated));
    setIsAddModalOpen(false);
    setNewComp({ name: '', category: 'Cognitive', description: '', indicators: '' });
    showToast(`Competency "${created.name}" created!`);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this competency?')) return;
    const updated = competencies.filter(c => c.id !== id);
    setCompetencies(updated);
    localStorage.setItem('cbc_competencies', JSON.stringify(updated));
    showToast('Competency removed.');
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <CbcHeader activeTab="competencies" />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-100 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-850">The 7 Global 21st-Century Core Competencies</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Evaluated transversally across all academic subjects and co-curricular programs in the CBC framework.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Custom Competency
          </button>
        </div>

        {/* Toolbar & Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            {['All', 'Cognitive', 'Interpersonal', 'Social-Emotional', 'Metacognitive', 'Technological'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition ${
                  categoryFilter === cat
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search competencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Competencies Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCompetencies.map((comp) => {
            const isExpanded = expandedId === comp.id;

            return (
              <div
                key={comp.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex justify-between items-start gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${comp.iconBg} font-bold flex items-center justify-center shrink-0 shadow-2xs`}>
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-850 leading-tight">
                          {comp.name}
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mt-1 inline-block">
                          {comp.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(comp.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {comp.description}
                  </p>

                  {/* Observable Behavioral Indicators */}
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Observable Classroom Indicators:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 pl-1">
                      {(comp.indicators || []).map((ind, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rubric Accordion Toggle */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition"
                    >
                      {isExpanded ? 'Hide Rubric Descriptors' : 'View 4-Level Evaluation Rubrics'}
                    </button>

                    {isExpanded && comp.rubrics && (
                      <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] animate-in fade-in duration-150">
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                          <strong className="text-emerald-800 block mb-0.5 font-bold">EE (Level 4):</strong>
                          <span className="text-emerald-900 leading-tight">{comp.rubrics.lvl4}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                          <strong className="text-blue-800 block mb-0.5 font-bold">ME (Level 3):</strong>
                          <span className="text-blue-900 leading-tight">{comp.rubrics.lvl3}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                          <strong className="text-amber-800 block mb-0.5 font-bold">AE (Level 2):</strong>
                          <span className="text-amber-900 leading-tight">{comp.rubrics.lvl2}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100">
                          <strong className="text-rose-800 block mb-0.5 font-bold">BE (Level 1):</strong>
                          <span className="text-rose-900 leading-tight">{comp.rubrics.lvl1}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal: Add Custom Competency */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-teal-600 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Star className="w-4 h-4" /> Add Custom Competency
              </h3>
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompetency} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Competency Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Financial Savviness & Enterprise"
                  value={newComp.name}
                  onChange={(e) => setNewComp(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Domain Category</label>
                <select
                  value={newComp.category}
                  onChange={(e) => setNewComp(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Cognitive">Cognitive</option>
                  <option value="Interpersonal">Interpersonal</option>
                  <option value="Social-Emotional">Social-Emotional</option>
                  <option value="Metacognitive">Metacognitive</option>
                  <option value="Technological">Technological</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Definition</label>
                <textarea
                  rows="2"
                  placeholder="What does this competency encompass?"
                  value={newComp.description}
                  onChange={(e) => setNewComp(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observable Indicators (One per line)</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Budgeting skills&#10;Identifies value for money"
                  value={newComp.indicators}
                  onChange={(e) => setNewComp(prev => ({ ...prev, indicators: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-sm"
                >
                  Save Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoreCompetencies;
