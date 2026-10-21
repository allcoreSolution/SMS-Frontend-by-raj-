import React, { useState } from 'react';
import { Lock, Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const initPages = [
  { id: 1, title: 'About Us', slug: '/about-us', status: 'Published', lastUpdated: '7 months ago' },
  { id: 2, title: 'Privacy Policy', slug: '/privacy-policy', status: 'Published', lastUpdated: '7 months ago' },
  { id: 3, title: 'Contact Us', slug: '/contact-us', status: 'Published', lastUpdated: '5 months ago' },
  { id: 4, title: 'Terms of Service', slug: '/terms', status: 'Draft', lastUpdated: '1 month ago' },
];

export default function WebsitePages() {
  const [pages, setPages] = useState(initPages);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering
  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPages.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedPages = filteredPages.slice(startIndex, startIndex + pageSize);

  // Actions
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this page?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setPages(pages.filter(p => p.id !== id));
        if (displayedPages.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-[22px] font-medium text-gray-800">Manage Pages</h1>
        <button 
          onClick={() => Swal.fire({ icon: 'info', text: 'Add Page functionality would open a modal/form here.', confirmButtonColor: '#0891b2' })}
          className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white rounded-none hover:bg-orange-600 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          Add New Page
        </button>
      </div>

      {/* Demo Warning */}
      <div className="flex items-center gap-2 bg-[#fff8e1] border border-[#fde68a] rounded-none p-4 mb-6 text-sm text-[#854d0e]">
        <Lock className="w-4 h-4 text-[#ca8a04] flex-shrink-0" />
        <p>
          <strong>Demo mode:</strong> this is public website content — read-only in demo mode: saving, publishing and deleting are disabled for security.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white border-t-2 border-orange-500 rounded-none shadow-sm">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-300">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <span>Show</span>
            <select 
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-400 rounded-none px-2 py-1 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <span>Search:</span>
            <input 
              type="text" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-400 rounded-none px-3 py-1 focus:outline-none focus:border-gray-500" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300 w-16">ID <span className="text-gray-400 float-right font-normal">⇅</span></th>
                <th className="px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300">Title <span className="text-gray-400 float-right font-normal">⇅</span></th>
                <th className="px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300">URL Slug <span className="text-gray-400 float-right font-normal">⇅</span></th>
                <th className="px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300">Status <span className="text-gray-400 float-right font-normal">⇅</span></th>
                <th className="px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300">Last Updated <span className="text-gray-400 float-right font-normal">⇅</span></th>
                <th className="px-4 py-2 text-sm font-bold text-gray-800 border border-gray-300 w-28">Actions <span className="text-gray-400 float-right font-normal">⇅</span></th>
              </tr>
            </thead>
            <tbody>
              {displayedPages.length > 0 ? (
                displayedPages.map((page, index) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{page.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{page.title}</td>
                    <td className="px-4 py-2 text-sm text-[#f97316] border border-gray-300">{page.slug}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <span className={`inline-flex items-center px-2 py-1 rounded-none text-[11px] font-bold text-white ${
                        page.status === 'Published' ? 'bg-[#22c55e]' : 'bg-[#6c757d]'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{page.lastUpdated}</td>
                    <td className="px-4 py-2 text-sm border border-gray-300">
                      <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1 bg-[#17a2b8] hover:bg-[#138496] text-white px-2 py-1 rounded-none text-xs transition-colors">
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(page.id)}
                          className="flex items-center gap-1 bg-[#f87171] hover:bg-[#ef4444] text-white px-2 py-1 rounded-none text-xs transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500 border border-gray-300">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-300 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredPages.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, filteredPages.length)} of {filteredPages.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-none bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-none ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-none bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
