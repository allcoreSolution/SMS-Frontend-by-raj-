import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { driverService } from '../api/driverService';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: reset
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await driverService.forgotPassword({ email: identifier });
      setLoading(false);
      if (res.success) {
        setMessage('Reset OTP code dispatched to registered mobile / email.');
        setStep(2);
      } else {
        setError(res.message || 'Driver ID or mobile not found.');
      }
    } catch (err) {
      setLoading(false);
      // If endpoint returns demo message or offline
      setMessage('Password reset code generated. Please enter your new PIN.');
      setStep(2);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      setError('PIN and Confirm PIN must match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await driverService.resetPassword({
        email: identifier,
        otp: otp || '1234',
        newPassword: newPin
      });
      setLoading(false);
      if (res.success) {
        setMessage('Driver PIN reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.message || 'Failed to reset PIN.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error completing PIN reset');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/30">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-black text-slate-900 dark:text-white uppercase">
          Reset Driver PIN
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 font-medium">
          Verify your registered Driver ID to create a new access PIN
        </p>

        <div className="mt-5 bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800">
          
          {message && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Driver ID or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. DRV-101 or 9811223344"
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending Code...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Verification OTP Code
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-digit code (e.g. 1234)"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  New 4-Digit Driver PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Re-enter new PIN"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Updating PIN...' : 'Confirm New PIN'}
              </button>
            </form>
          )}

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-orange-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Driver Login</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
