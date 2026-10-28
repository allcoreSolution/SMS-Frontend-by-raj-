import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useLanguage } from '../context/LanguageContext';
import { 
  Lock, User, ArrowRight, ShieldCheck, GraduationCap, 
  LayoutDashboard, Eye, EyeOff, AlertCircle, KeyRound, 
  ExternalLink, Users, Check, Globe, Sparkles
} from 'lucide-react';

export default function Login() {
  const [roleTab, setRoleTab] = useState('student'); // 'student' | 'parent'
  const [userId, setUserId] = useState('YIS-2024-101');
  const [password, setPassword] = useState('secret_access_24');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filledNotice, setFilledNotice] = useState(false);
  const navigate = useNavigate();
  const { currentLang, setLanguage } = useLanguage();

  const isStudentRole = roleTab === 'student';

  const handleRoleChange = (role) => {
    setRoleTab(role);
    setError('');
    localStorage.removeItem('active_child');
    if (role === 'student') {
      setUserId('YIS-2024-101');
    } else {
      setUserId('P-1920-KABIR');
    }
  };

  const handleSelectStudentDemo = () => {
    setRoleTab('student');
    setUserId('YIS-2024-101');
    setPassword('secret_access_24');
    setError('');
    setFilledNotice(true);
    setTimeout(() => setFilledNotice(false), 2000);
  };

  const handleSelectParentDemo = () => {
    setRoleTab('parent');
    setUserId('P-1920-KABIR');
    setPassword('secret_access_24');
    setError('');
    setFilledNotice(true);
    setTimeout(() => setFilledNotice(false), 2000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.removeItem('active_child');
      localStorage.removeItem('parent_user');
      localStorage.removeItem('parent_token');
      
      const res = await authService.login({ userId, password, role: roleTab });
      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setError(res?.message || (currentLang === 'hi' ? 'लॉगिन विफल। कृपया क्रेडेंशियल जांचें।' : 'Login failed. Please check credentials.'));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Connection failed';
      if (String(msg).toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setError(currentLang === 'hi' ? 'सर्वर से संपर्क हो रहा है, डेमो मोड सक्रिय किया जा रहा है...' : 'Server connecting, attempting demo mode...');
        try {
          const fallback = await authService.login({ userId, password, role: roleTab });
          if (fallback && fallback.success) {
            navigate('/dashboard');
            return;
          }
        } catch (_) {}
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans">

      {/* ── LEFT SIDE: BRANDING PANEL (ADAPTS DYNAMICALLY TO ROLE) ── */}
      <div className={`hidden lg:flex flex-col relative w-full lg:w-1/2 bg-gradient-to-br ${
        isStudentRole 
          ? 'from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]' 
          : 'from-[#064E3B] via-[#059669] to-[#047857]'
      } overflow-hidden justify-between p-12 xl:p-16 text-white shadow-2xl transition-colors duration-500`}>
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-6 text-white shadow-sm">
            {isStudentRole ? (
              <GraduationCap className="w-4 h-4 text-amber-300" />
            ) : (
              <Users className="w-4 h-4 text-emerald-200" />
            )}
            <span className="text-[11px] font-black uppercase tracking-wider">
              ACS Smart Campus &bull; {isStudentRole ? 'Student Workspace' : 'Parent Supervisory Desk'}
            </span>
          </div>

          <h1 className="text-white text-4xl xl:text-5xl font-black tracking-tight leading-tight font-serif">
            {isStudentRole ? (
              <>
                Next-Gen <br />
                <span className="text-amber-300">Student Learning</span> <br />
                Digital Portal.
              </>
            ) : (
              <>
                Empowered <br />
                <span className="text-emerald-200">Parent Monitoring</span> <br />
                Digital Desk.
              </>
            )}
          </h1>

          <p className="mt-5 text-white/90 text-xs xl:text-sm font-medium leading-relaxed max-w-md">
            {isStudentRole
              ? 'Real-time academic synchronization: class timetable, homework submission, CBSE attendance, CBT online examinations, and 24/7 AI learning assistant.'
              : 'Direct oversight for guardians: multi-ward academic monitoring, secure fee payments, real-time bus telemetry tracking, report cards, and official PTM schedule.'
            }
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            {/* Feature 1 */}
            <div className={`p-4 rounded-2xl backdrop-blur-md border transition-all ${
              isStudentRole ? 'bg-white/20 border-white/30 shadow-md' : 'bg-white/10 border-white/15 opacity-75'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2 text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-wide mb-1">
                {currentLang === 'hi' ? 'विद्यार्थी स्पेस' : 'Student Space'}
              </h3>
              <p className="text-white/80 text-[11px] leading-relaxed">
                {currentLang === 'hi' 
                  ? 'गृहकार्य, दैनिक डायरी, क्लासवर्क, ऑनलाइन परीक्षा और परिणाम।' 
                  : 'Homework, daily diary, study notes, live classes, CBT exams & grades.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-4 rounded-2xl backdrop-blur-md border transition-all ${
              !isStudentRole ? 'bg-white/20 border-white/30 shadow-md' : 'bg-white/10 border-white/15 opacity-75'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2 text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-wide mb-1">
                {currentLang === 'hi' ? 'अभिभावक डेस्क' : 'Parent Desk'}
              </h3>
              <p className="text-white/80 text-[11px] leading-relaxed">
                {currentLang === 'hi' 
                  ? 'मल्टी-वार्ड स्विच, ऑनलाइन फीस रसीद, लाइव बस ट्रैकिंग और पीटीएम।' 
                  : 'Multi-ward switcher, fee installment clearance, live GPS tracking & PTM.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-white/80">
          <span>&copy; {new Date().getFullYear()} ACS International School &bull; All Rights Reserved</span>
          <span className="font-semibold text-white">
            Engineered by <strong className="text-amber-300">RAJ YADAV</strong> @ALLCORE SOLUTION
          </span>
        </div>
      </div>

      {/* ── RIGHT SIDE: LOGIN FORM (50%) ── */}
      <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-12 xl:p-16 relative z-10 w-full lg:w-1/2 bg-white min-h-screen lg:min-h-0 overflow-y-auto">

        {/* Top Header & Language Switcher */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs transition-colors ${
              isStudentRole ? 'bg-[#2563EB]' : 'bg-[#059669]'
            }`}>
              {isStudentRole ? <GraduationCap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-gray-900 text-xs sm:text-sm font-serif">ACS Smart Campus</span>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isStudentRole ? 'text-blue-600' : 'text-emerald-600'}`}>
                {isStudentRole ? 'Student Portal' : 'Parent Portal'}
              </span>
            </div>
          </div>

          {/* Language Switch Button */}
          <button
            type="button"
            onClick={() => setLanguage(currentLang === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentLang === 'hi' ? '🇬🇧 English' : '🇮🇳 हिन्दी'}</span>
          </button>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-2">
          
          {/* Logo Header */}
          <div className="mb-5 flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2.5 shadow-lg transition-all duration-300 ${
              isStudentRole 
                ? 'bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-blue-500/25' 
                : 'bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-emerald-500/25'
            }`}>
              {isStudentRole ? <GraduationCap className="h-7 w-7" /> : <Users className="h-7 w-7" />}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
              {isStudentRole 
                ? (currentLang === 'hi' ? 'विद्यार्थी पोर्टल लॉगिन' : 'Student Portal Login')
                : (currentLang === 'hi' ? 'अभिभावक पोर्टल लॉगिन' : 'Parent Portal Login')
              }
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {currentLang === 'hi'
                ? 'पोर्टल में प्रवेश के लिए अपनी भूमिका का चयन करें'
                : 'Select your role to access academics, fees & communications'
              }
            </p>
          </div>

          {/* DUAL ROLE TAB SWITCHER: STUDENT vs PARENT */}
          <div className="mb-4 p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isStudentRole
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{currentLang === 'hi' ? 'विद्यार्थी लॉगिन' : 'Student Login'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('parent')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isStudentRole
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{currentLang === 'hi' ? 'अभिभावक लॉगिन' : 'Parent Login'}</span>
            </button>
          </div>

          {/* FAST ONE-CLICK DEMO IDENTITY CARDS */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                {currentLang === 'hi' ? 'त्वरित डेमो क्रेडेंशियल्स' : 'Quick Demo Credentials'}
              </span>
              {filledNotice && (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 animate-in fade-in">
                  ✓ {currentLang === 'hi' ? 'फॉर्म भर दिया गया!' : 'Credentials Applied!'}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Student Demo Card */}
              <button
                type="button"
                onClick={handleSelectStudentDemo}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                  isStudentRole && userId === 'YIS-2024-101'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                    A
                  </div>
                  <span className="text-xs font-black text-slate-900 truncate">Aarav Sharma</span>
                </div>
                <p className="text-[9.5px] font-bold text-blue-700 mt-1 truncate">
                  YIS-2024-101 &bull; Class I
                </p>
                <span className="text-[8.5px] font-medium text-slate-500 block truncate">
                  Role: Student
                </span>
              </button>

              {/* Parent Demo Card */}
              <button
                type="button"
                onClick={handleSelectParentDemo}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                  !isStudentRole
                    ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                    V
                  </div>
                  <span className="text-xs font-black text-slate-900 truncate">Vikram Chauhan</span>
                </div>
                <p className="text-[9.5px] font-bold text-emerald-700 mt-1 truncate">
                  P-1920-KABIR &bull; 2 Wards
                </p>
                <span className="text-[8.5px] font-medium text-slate-500 block truncate">
                  Role: Parent
                </span>
              </button>
            </div>
          </div>

          {/* In-page Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="block">{error}</span>
                <button
                  type="button"
                  onClick={isStudentRole ? handleSelectStudentDemo : handleSelectParentDemo}
                  className="mt-1 text-[10.5px] font-bold underline hover:text-rose-900 cursor-pointer"
                >
                  {currentLang === 'hi' ? 'डेमो क्रेडेंशियल से पुनः प्रयास करें →' : 'Retry with verified Demo Credentials →'}
                </button>
              </div>
            </div>
          )}

          {/* Form Section */}
          <form className="space-y-3.5" onSubmit={handleLogin}>

            {/* ID Input */}
            <div>
              <label htmlFor="userId" className="block text-xs font-bold text-slate-700 mb-1">
                {isStudentRole 
                  ? (currentLang === 'hi' ? 'विद्यार्थी रोल नं. / प्रवेश क्रमांक' : 'Student Roll No / Admission ID')
                  : (currentLang === 'hi' ? 'अभिभावक पोर्टल आईडी / मोबाइल नंबर' : 'Parent Portal ID / Registered Mobile')
                }
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {isStudentRole ? (
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Users className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={`block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white text-xs font-bold text-slate-900 transition-all shadow-2xs ${
                    isStudentRole 
                      ? 'focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600' 
                      : 'focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600'
                  }`}
                  placeholder={
                    isStudentRole 
                      ? 'e.g. YIS-2024-101 or Aarav' 
                      : 'e.g. P-1920-KABIR or 9876510108'
                  }
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                  {currentLang === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <span className="text-[10px] font-semibold text-slate-400">
                  {currentLang === 'hi' ? 'डिफ़ॉल्ट:' : 'Default:'} secret_access_24
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white text-xs font-bold text-slate-900 transition-all shadow-2xs ${
                    isStudentRole 
                      ? 'focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600' 
                      : 'focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className={`w-4 h-4 rounded border-slate-300 cursor-pointer ${
                    isStudentRole ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'
                  }`}
                />
                <span>{currentLang === 'hi' ? 'सत्र याद रखें' : 'Remember session'}</span>
              </label>
              <span className={`text-[11px] font-bold ${isStudentRole ? 'text-blue-600' : 'text-emerald-600'}`}>
                {currentLang === 'hi' ? 'सेंट्रल नोड ऑनलाइन' : 'Central Node Live'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] shadow-lg ${
                isStudentRole
                  ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 shadow-blue-600/30 hover:opacity-95'
                  : 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 shadow-emerald-600/30 hover:opacity-95'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isStudentRole 
                      ? (currentLang === 'hi' ? 'विद्यार्थी पोर्टल में प्रवेश करें →' : 'Sign In to Student Portal →')
                      : (currentLang === 'hi' ? 'अभिभावक पोर्टल में प्रवेश करें →' : 'Sign In to Parent Portal →')
                    }
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 pt-2 text-slate-400 justify-center w-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{currentLang === 'hi' ? 'सुरक्षित एन्क्रिप्टेड कनेक्शन' : 'Direct Central Database Link'}</span>
            </div>

          </form>

          {/* Quick links */}
          <div className="mt-5 pt-3 border-t border-slate-200 text-center text-xs text-slate-500">
            <div className="flex items-center justify-center gap-2">
              <span>Main Portal:</span>
              <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>localhost:5173</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Small watermark on right side */}
        <div className="w-full text-center py-1 text-[11px] font-medium text-slate-500 select-none">
          Built with ❤️ by <strong className="text-slate-800 font-bold">RAJ YADAV</strong> <span className="text-blue-600 font-bold">@ALLCORE SOLUTION</span>
        </div>
      </div>

    </div>
  );
}
