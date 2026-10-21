import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const [status, setStatus] = useState('processing'); // 'processing' | 'done'
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate cleanup tasks
    localStorage.removeItem('parent_token');

    // Switch to done state instead of bouncing back to '/'
    const timer = setTimeout(() => {
      setStatus('done');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 fixed inset-0 z-50">
      <div className="bg-white border border-gray-200 p-8 rounded-none shadow-xl flex flex-col items-center gap-5 min-w-[340px] max-w-sm text-center">

        {status === 'processing' ? (
          <>
            <div className="relative mb-2">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 z-10 relative" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-gray-800 font-extrabold text-[15px] tracking-tight uppercase">Signing out securely</p>
              <p className="text-gray-400 font-bold tracking-widest text-[10px] mt-1.5 uppercase">Terminating session...</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-none flex items-center justify-center mb-1">
              <ShieldCheck className="w-7 h-7 text-green-600" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-green-700 font-black text-[16px] tracking-tight uppercase">Session Ended</p>
              <p className="text-gray-500 font-bold tracking-widest text-[10px] mt-1.5 uppercase leading-relaxed">
                You have successfully logged out of the parent portal.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest py-3 border border-indigo-800 rounded-none shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Return to Login <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

      </div>

      {/* Brand Watermark footer */}
      <div className="absolute bottom-6 text-[9.5px] font-black uppercase tracking-widest text-gray-400">
        Developed by RAJ YADAV @All Core Solution
      </div>
    </div>
  );
}
