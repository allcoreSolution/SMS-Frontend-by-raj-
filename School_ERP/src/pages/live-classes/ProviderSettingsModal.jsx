import React from 'react';
import { X, Layers, AlertTriangle, ExternalLink, Video } from 'lucide-react';

export default function ProviderSettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10 overflow-y-auto font-sans">
      <div className="bg-gray-50 rounded-none shadow-xl w-full max-w-5xl mb-10 overflow-hidden flex flex-col border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#5542f6] rounded-none flex items-center justify-center mr-3 text-white">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">Live Class Providers</h2>
              <p className="text-[10px] font-bold text-[#5542f6] uppercase tracking-widest mt-0.5">CONFIGURE HOSTING</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-gray-50 flex-grow">
          <p className="text-sm text-gray-600 mb-6 max-w-2xl">
            Choose how your live classes are hosted. Enable one or more providers, set a default, 
            and provide any credentials the provider needs. Teachers pick from your enabled 
            providers when scheduling a class.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Jitsi Meet Card */}
            <div className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <Video className="w-5 h-5 text-[#5542f6] mr-2" />
                  <h3 className="font-bold text-gray-800">Jitsi Meet</h3>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-gray-200 rounded-none relative cursor-pointer mr-2">
                    <div className="w-4 h-4 bg-white rounded-none absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Disabled</span>
                </div>
              </div>
              
              <div className="p-5 flex-grow space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-none border border-gray-200 flex items-center">
                    <span className="mr-1">🔊</span> Embedded
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-none border border-green-100 flex items-center">
                    <span className="mr-1">🧑‍🤝‍🧑</span> Auto attendance (events)
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-none border border-blue-100 flex items-center">
                    <span className="mr-1">⏺️</span> Recordings manual
                  </span>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-none p-3 flex items-start">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 mr-2 shrink-0" />
                  <p className="text-xs text-orange-800">
                    <strong>Using the shared public Jitsi server (sign-in required, limited).</strong> Add a domain & JaaS keys below for reliable rooms.
                  </p>
                </div>

                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                  <li>Leave blank to use the shared public server (limited — sign in required).</li>
                  <li>For reliable rooms, run a self-hosted Jitsi or use 8x8 JaaS and fill in the domain, App ID and secret.</li>
                </ul>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Server Domain</label>
                    <input type="text" className="w-full border border-gray-300 rounded-none p-2 focus:border-[#5542f6] outline-none text-sm" />
                    <p className="text-[10px] text-gray-400 mt-1">e.g. meet.jit.si or your self hosted / 8x8 JaaS domain.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">App ID (JaaS)</label>
                    <input type="text" className="w-full border border-gray-300 rounded-none p-2 focus:border-[#5542f6] outline-none text-sm" />
                    <p className="text-[10px] text-gray-400 mt-1">Only for 8x8 JaaS / JWT secured servers.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">App Secret</label>
                    <input type="text" className="w-full border border-gray-300 rounded-none p-2 focus:border-[#5542f6] outline-none text-sm" />
                    <p className="text-[10px] text-gray-400 mt-1">JWT signing secret for JaaS / secured servers.</p>
                  </div>
                </div>

                <a href="#" className="text-xs text-orange-500 hover:underline flex items-center font-medium">
                  <ExternalLink className="w-3 h-3 mr-1" /> Provider documentation
                </a>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded-none text-[#5542f6] focus:ring-[#5542f6]" />
                  Set as default
                </label>
                <button className="bg-[#5542f6] hover:bg-indigo-700 text-white font-medium px-4 py-1.5 rounded-none text-sm transition-colors shadow-sm">
                  Save
                </button>
              </div>
            </div>

            {/* Right Column containing External Link and Zoom */}
            <div className="space-y-6 flex flex-col h-full">
              
              {/* External Link Card */}
              <div className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <Video className="w-5 h-5 text-[#5542f6] mr-2" />
                    <h3 className="font-bold text-gray-800">External Link (Zoom / Meet / Teams)</h3>
                    <span className="ml-2 text-[10px] bg-indigo-50 text-[#5542f6] px-1.5 py-0.5 rounded-none font-semibold border border-indigo-100">Default</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-5 bg-[#5542f6] rounded-none relative cursor-pointer mr-2">
                      <div className="w-4 h-4 bg-white rounded-none absolute right-0.5 top-0.5 shadow-sm"></div>
                    </div>
                    <span className="text-xs font-semibold text-[#5542f6] uppercase">Enabled</span>
                  </div>
                </div>
                
                <div className="p-5 flex-grow space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-none border border-gray-200 flex items-center">
                      <span className="mr-1">↗️</span> Redirect
                    </span>
                    <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-none border border-orange-100 flex items-center">
                      <span className="mr-1">🧑‍🤝‍🧑</span> Manual attendance
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-none border border-blue-100 flex items-center">
                      <span className="mr-1">⏺️</span> Recordings manual
                    </span>
                  </div>

                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-2 mt-4">
                    <li>When scheduling a class, paste the full meeting URL from Zoom, Google Meet or Teams.</li>
                    <li>Attendance for external links is recorded manually (teacher roll or student self-mark).</li>
                  </ul>

                  <div className="pt-2">
                    <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-none border border-green-100">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-none mr-1.5"></span> No credentials required
                    </span>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mr-2 rounded-none text-[#5542f6] focus:ring-[#5542f6]" />
                    Set as default
                  </label>
                  <button className="bg-[#5542f6] hover:bg-indigo-700 text-white font-medium px-4 py-1.5 rounded-none text-sm transition-colors shadow-sm">
                    Save
                  </button>
                </div>
              </div>

              {/* Zoom Card */}
              <div className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm flex flex-col flex-grow">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <Video className="w-5 h-5 text-[#5542f6] mr-2" />
                    <h3 className="font-bold text-gray-800">Zoom</h3>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-5 bg-gray-200 rounded-none relative cursor-pointer mr-2">
                      <div className="w-4 h-4 bg-white rounded-none absolute left-0.5 top-0.5 shadow-sm"></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Disabled</span>
                  </div>
                </div>
                
                <div className="p-5 flex-grow space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-none border border-gray-200 flex items-center">
                      <span className="mr-1">↗️</span> Redirect
                    </span>
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-none border border-green-100 flex items-center">
                      <span className="mr-1">🧑‍🤝‍🧑</span> Auto attendance (webhooks)
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-none border border-blue-100 flex items-center">
                      <span className="mr-1">⏺️</span> Recordings api
                    </span>
                  </div>

                  <ul className="list-disc pl-5 text-[11px] text-gray-600 space-y-1">
                    <li>In the Zoom Marketplace, create a Server-to-Server OAuth app.</li>
                    <li>Grant the meeting:write and meeting:read scopes, then activate the app.</li>
                    <li>Copy the Account ID, Client ID and Client Secret into the fields below.</li>
                  </ul>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Account ID <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full border border-gray-300 rounded-none p-1.5 focus:border-[#5542f6] outline-none text-sm" />
                      <p className="text-[9px] text-gray-400 mt-0.5">Server-to-Server OAuth app — App Credentials.</p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Client ID <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full border border-gray-300 rounded-none p-1.5 focus:border-[#5542f6] outline-none text-sm" />
                      <p className="text-[9px] text-gray-400 mt-0.5">Server-to-Server OAuth app — App Credentials.</p>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Client Secret <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full border border-gray-300 rounded-none p-1.5 focus:border-[#5542f6] outline-none text-sm" />
                      <p className="text-[9px] text-gray-400 mt-0.5">Server-to-Server OAuth app — App Credentials.</p>
                    </div>
                  </div>

                  <a href="#" className="text-xs text-orange-500 hover:underline flex items-center font-medium pt-1">
                    <ExternalLink className="w-3 h-3 mr-1" /> Provider documentation
                  </a>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 mt-auto">
                  <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded-none text-[#5542f6] focus:ring-[#5542f6]" />
                    Set as default
                  </label>
                  <button className="bg-[#5542f6] hover:bg-indigo-700 text-white font-medium px-4 py-1.5 rounded-none text-sm transition-colors shadow-sm">
                    Save
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
