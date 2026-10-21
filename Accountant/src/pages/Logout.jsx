import React, { useEffect } from 'react';
import { LogOut, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout();
    Swal.fire({
      title: 'Logged Out',
      text: 'Your session has been securely closed.',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#d2d6de] flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-[400px] text-center">
        <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#00a65a] shadow-md p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00a65a]">
            <LogOut className="w-8 h-8 ml-1" />
          </div>
          <h2 className="text-[20px] font-bold text-[#333] mb-2">You are logged out</h2>
          <p className="text-[14px] text-gray-500 mb-6">
            Thank you for using the ALL CORE SOLUTION ERP System.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-2 rounded-[3px] text-[14px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Sign In Again <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
