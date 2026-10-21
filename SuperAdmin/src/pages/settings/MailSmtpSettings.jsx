import React from 'react';
import { Lock, Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';

export default function MailSmtpSettings() {
  return (
    <SettingsLayout activeTab="mail-smtp">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">
          
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-none-none bg-blue-50 flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Mail (SMTP)</h1>
            <p className="text-sm text-gray-500 max-w-[1150px] leading-relaxed mb-6">
              Outgoing email server settings, with a live "send test email" tool.
            </p>
            <div className="flex flex-col gap-2 mb-6 text-left w-full max-w-[1150px]">
              {['Set SMTP host, port, encryption and credentials', 'Send a test email to confirm delivery'].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
            <button onClick={() => window.open('/settings-mail-smtp-workspace', '_blank')}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-none-none transition-colors text-sm">
              <ExternalLink className="w-4 h-4" /> Open Mail (SMTP)
            </button>
            <p className="text-xs text-gray-400 mt-3">Opens the full workspace in a new tab.</p>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
