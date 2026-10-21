import React from 'react';
import { Plus, BookOpen, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddNewCustomField = () => {
  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Add New Custom Field</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Form Content */}
        <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-[#5F52FF] font-semibold mb-6">
            <Plus className="w-5 h-5" />
            Field Configuration
          </div>
          
          <div className="border-t border-gray-100 pt-6 space-y-6">
            {/* Field Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Field Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., Aadhaar Number, Blood Group" 
                className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5F52FF] focus:border-[#5F52FF] placeholder-gray-400 shadow-sm"
              />
            </div>

            {/* Dropdowns row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Belongs To <span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5F52FF] focus:border-[#5F52FF] bg-white shadow-sm">
                  <option>Student Admission Form</option>
                  <option>Staff Form</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Field Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5F52FF] focus:border-[#5F52FF] bg-white shadow-sm">
                  <option>Short Text</option>
                  <option>Number</option>
                  <option>Date</option>
                  <option>Text Area</option>
                  <option>Dropdown</option>
                  <option>File</option>
                </select>
              </div>
            </div>

            {/* Toggle switch */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5F52FF]"></div>
              </label>
              <span className="text-sm text-gray-700 font-medium">This field is absolutely required during data entry</span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link 
                to="/students/custom-fields"
                className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-none bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Link>
              <button className="flex items-center gap-2 bg-[#5F52FF] text-white px-5 py-2 rounded-none hover:bg-[#4E41E6] transition-colors text-sm font-semibold shadow-sm">
                <Save className="w-4 h-4" />
                Save Custom Field
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-800 font-bold mb-4 text-sm">
              <BookOpen className="w-4 h-4" />
              Understanding Custom Fields
            </div>
            
            <ul className="space-y-4 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 flex-shrink-0"></span>
                <p><strong>What are they?</strong> Custom fields dynamically stretch your database, allowing you to collect specialized data beyond standard forms (e.g., Aadhaar Number, Bus Route, Caste).</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 flex-shrink-0"></span>
                <p><strong>Belongs To (Scope):</strong> a <strong>Students</strong> field instantly appears on all online and offline Admission Forms; a <strong>Staff</strong> field only asks HR during onboarding.</p>
              </li>
              <li className="flex items-start gap-2 border-t border-gray-100 pt-3">
                <span className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 flex-shrink-0"></span>
                <p><strong>Short Text:</strong> general details (e.g. Religion). <strong>Number:</strong> forces strict numeric input. <strong>Date:</strong> spawns a calendar UI.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-none bg-[#5F52FF] mt-1.5 flex-shrink-0"></span>
                <p><strong>Text Area:</strong> multiline box (e.g. Medical History). <strong>Dropdown:</strong> select from fixed choices. <strong>File:</strong> upload a document.</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddNewCustomField;
