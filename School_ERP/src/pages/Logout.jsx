import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const Logout = () => {
  useEffect(() => {
    // Clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Hard refresh into login
    setTimeout(() => {
      window.location.href = '/login';
    }, 400);
  }, []);

  return (
    <div className="flex h-[80vh] items-center justify-center bg-transparent flex-col gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      <p className="text-slate-600 font-semibold uppercase tracking-widest text-sm">Signing out securely...</p>
    </div>
  );
};

export default Logout;
