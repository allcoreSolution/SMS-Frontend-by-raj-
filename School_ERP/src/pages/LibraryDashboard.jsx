import React, { useState, useEffect } from 'react';
import { 
  Book, ArrowUpRight, AlertCircle, FileDown, Plus, LayoutGrid, HelpCircle, 
  ArrowLeftRight, Tags, Settings, FileText, Search, Eye, Edit2, BarChart2,
  Bell, ChevronDown, Share2, ArrowRight, Clock, ScanBarcode, Printer, User,
  Calendar, RotateCcw, Zap, CreditCard, CheckCircle, Hourglass, Check, 
  BookOpen, X, Compass, Users, Columns, Loader2, Sparkles, Trash2, Send
} from 'lucide-react';
import Swal from 'sweetalert2';
import { libraryService } from '../api/libraryService';
import { academicService } from '../api/academicService';
import QuickAddClassModal from '../components/academics/QuickAddClassModal';

export default function LibraryDashboard({ initialTab = 'Overview' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [isQuickAddClassOpen, setIsQuickAddClassOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  // Core Data States
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalTitles: 0,
    totalCopies: 0,
    availableCopies: 0,
    activeIssued: 0,
    overdueCount: 0,
    categoriesCount: 0,
    pendingRequests: 0,
    fineCollectedTotal: '₹0'
  });
  const [members, setMembers] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categorySearch, setCategorySearch] = useState('');

  // Add Book Form State
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    publisher: '',
    publishedYear: new Date().getFullYear(),
    edition: '1st Edition',
    language: 'English',
    pageCount: 320,
    subject: '',
    shelfNumber: 'Shelf A-01',
    rackNumber: 'Rack 01',
    quantity: 5,
    price: 450,
    classRestriction: 'All Classes',
    description: '',
    coverUrl: '',
    isDigital: false
  });
  const [fetchingIsbn, setFetchingIsbn] = useState(false);
  const [isbnSearchInput, setIsbnSearchInput] = useState('');

  // Issue Book Form State
  const [issueForm, setIssueForm] = useState({
    memberType: 'Student',
    memberId: '',
    memberName: '',
    memberPhone: '',
    bookId: '',
    days: 14
  });
  const [selectedReturnMemberId, setSelectedReturnMemberId] = useState('');

  // New Category Form State
  const [catForm, setCatForm] = useState({
    name: '',
    code: '',
    section: 'Wing A',
    description: ''
  });

  // New Request Form State
  const [reqForm, setReqForm] = useState({
    title: '',
    author: '',
    isbn: '',
    requestedBy: '',
    requesterRole: 'Student',
    requesterClass: 'Class X',
    reason: 'Required for exam preparation'
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    loadAllLibraryData();
  }, []);

  const loadAllLibraryData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchBooks(),
        fetchCategories(),
        fetchIssuedBooks(),
        fetchRequests(),
        fetchMembersAndClasses()
      ]);
    } catch (err) {
      console.error('Failed to load library data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await libraryService.getStats();
      if (res?.success && res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await libraryService.getBooks();
      const list = res?.data || res || [];
      setBooks(list);
    } catch (e) {
      console.error(e);
      setBooks([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await libraryService.getCategories();
      const list = res?.data || res || [];
      setCategories(list);
    } catch (e) {
      console.error(e);
      setCategories([]);
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const res = await libraryService.getIssuedBooks();
      const list = res?.data || res || [];
      setIssuedBooks(list);
    } catch (e) {
      console.error(e);
      setIssuedBooks([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await libraryService.getRequests();
      const list = res?.data || res || [];
      setRequests(list);
    } catch (e) {
      console.error(e);
      setRequests([]);
    }
  };

  const fetchMembersAndClasses = async () => {
    try {
      const [clsRes, teachRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getTeachers()
      ]);

      if (clsRes?.success && Array.isArray(clsRes.data)) {
        setClassesList(clsRes.data);
      }

      // Load teachers and default student members
      let allMembers = [];
      if (teachRes?.success && Array.isArray(teachRes.data)) {
        teachRes.data.forEach(t => {
          allMembers.push({
            id: t._id,
            name: t.fullName || `${t.firstName || 'Teacher'} ${t.lastName || ''}`,
            type: 'Staff',
            subtitle: t.department ? `Faculty: ${t.department}` : 'Teaching Staff',
            phone: t.phone || '9876543210'
          });
        });
      }

      // Add student members
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
        const stRes = await fetch(`${apiUrl}/students?limit=25`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }).then(r => r.json());
        if (stRes?.data && Array.isArray(stRes.data)) {
          stRes.data.forEach(s => {
            allMembers.push({
              id: s._id,
              name: `${s.firstName} ${s.lastName || ''}`,
              type: 'Student',
              subtitle: `Adm: ${s.admissionNo || s.aparId} (${s.classId?.className || s.className || 'Class 10'})`,
              phone: s.studentPhone || s.fatherPhone || ''
            });
          });
        }
      } catch (err) {
        console.warn('Student fetch fallback:', err);
      }

      // Set members list (empty if no students/staff yet)
      setMembers(allMembers);
    } catch (e) {
      console.error(e);
    }
  };

  // Google Books Auto-Fill
  const handleFetchGoogleBook = async () => {
    if (!isbnSearchInput.trim()) {
      Swal.fire({
        title: 'ISBN or Title Required',
        text: 'Please enter an ISBN (e.g. 9780141036144) or book title to fetch details.',
        icon: 'info',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setFetchingIsbn(true);
      const query = encodeURIComponent(isbnSearchInput.trim());
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`).then(r => r.json());
      
      if (res?.items && res.items.length > 0) {
        const item = res.items[0].volumeInfo;
        const isbnObj = item.industryIdentifiers?.find(i => i.type === 'ISBN_13' || i.type === 'ISBN_10');
        
        setBookForm(prev => ({
          ...prev,
          title: item.title || prev.title,
          author: (item.authors && item.authors.join(', ')) || prev.author,
          publisher: item.publisher || prev.publisher,
          publishedYear: item.publishedDate ? parseInt(item.publishedDate.substring(0, 4)) : prev.publishedYear,
          pageCount: item.pageCount || prev.pageCount,
          isbn: isbnObj ? isbnObj.identifier : (prev.isbn || isbnSearchInput),
          description: item.description || prev.description,
          coverUrl: item.imageLinks?.thumbnail || item.imageLinks?.smallThumbnail || prev.coverUrl,
          language: item.language === 'en' ? 'English' : (item.language || 'English')
        }));

        Swal.fire({
          title: 'Auto-Filled Successfully!',
          text: `Fetched "${item.title}" by ${item.authors?.[0] || 'Author'}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
      } else {
        Swal.fire({
          title: 'Not Found on Google Books',
          text: 'No online match found. You can enter details manually.',
          icon: 'warning',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Fetch Error',
        text: 'Could not connect to Google Books API. Please fill in details manually.',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setFetchingIsbn(false);
    }
  };

  // Add Book Submission
  const handleSaveBook = async (e) => {
    e?.preventDefault();
    if (!bookForm.title.trim()) {
      Swal.fire({ title: 'Book Title Required', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    try {
      const payload = {
        ...bookForm,
        quantity: Number(bookForm.quantity) || 1,
        available: Number(bookForm.quantity) || 1,
        price: Number(bookForm.price) || 0,
        publishedYear: Number(bookForm.publishedYear) || 2024,
        category: bookForm.category || (categories[0]?.name || 'General')
      };

      const res = await libraryService.addBook(payload);
      if (res?.success) {
        Swal.fire({
          title: 'Book Catalogued!',
          text: `"${bookForm.title}" added to the library inventory.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsAdding(false);
        // Reset form
        setBookForm({
          title: '', author: '', category: '', isbn: '', publisher: '',
          publishedYear: 2024, edition: '1st Edition', language: 'English',
          pageCount: 300, subject: '', shelfNumber: 'Shelf A-01', rackNumber: 'Rack 01',
          quantity: 5, price: 450, classRestriction: 'All Classes', description: '',
          coverUrl: '', isDigital: false
        });
        fetchBooks();
        fetchStats();
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to catalogue book',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  };

  // Delete Book
  const handleDeleteBook = async (id, title) => {
    const result = await Swal.fire({
      title: 'Remove Book?',
      text: `Are you sure you want to remove "${title}" from the library catalog?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await libraryService.deleteBook(id);
        if (res?.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Book removed from catalog.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchBooks();
          fetchStats();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to delete book',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  // Issue Book Submission
  const handleIssueBook = async (e) => {
    e?.preventDefault();
    if (!issueForm.memberId) {
      Swal.fire({ title: 'Select Member', text: 'Please select a student or staff member.', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }
    if (!issueForm.bookId) {
      Swal.fire({ title: 'Select Book', text: 'Please choose an available book from the catalog.', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    const selectedMember = members.find(m => m.id === issueForm.memberId);
    const selectedBook = books.find(b => b._id === issueForm.bookId);

    try {
      const res = await libraryService.issueBook({
        bookId: issueForm.bookId,
        memberType: selectedMember?.type || issueForm.memberType,
        memberId: issueForm.memberId,
        memberName: selectedMember?.name || issueForm.memberName,
        memberPhone: selectedMember?.phone || issueForm.memberPhone,
        days: Number(issueForm.days) || 14
      });

      if (res?.success) {
        Swal.fire({
          title: 'Book Issued!',
          text: res.message || `Book issued to ${selectedMember?.name}.`,
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIssueForm({ memberType: 'Student', memberId: '', memberName: '', memberPhone: '', bookId: '', days: 14 });
        fetchBooks();
        fetchIssuedBooks();
        fetchStats();
      }
    } catch (err) {
      Swal.fire({
        title: 'Issue Failed',
        text: err.response?.data?.message || 'Could not complete circulation loan',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  };

  // Return Book
  const handleReturnBook = async (issueId, bookTitle, memberName) => {
    const confirm = await Swal.fire({
      title: 'Return Book?',
      text: `Confirm return of "${bookTitle}" issued to ${memberName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5542f6',
      confirmButtonText: 'Confirm Return',
      customClass: { popup: 'rounded-2xl' }
    });

    if (confirm.isConfirmed) {
      try {
        const res = await libraryService.returnBook(issueId);
        if (res?.success) {
          Swal.fire({
            title: 'Book Returned!',
            text: res.message || 'Loan closed and copy returned to shelf.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchBooks();
          fetchIssuedBooks();
          fetchStats();
        }
      } catch (err) {
        Swal.fire({
          title: 'Return Failed',
          text: err.response?.data?.message || 'Failed to process return',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  // Add Category
  const handleSaveCategory = async (e) => {
    e?.preventDefault();
    if (!catForm.name.trim()) {
      Swal.fire({ title: 'Category Name Required', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    try {
      const res = await libraryService.addCategory({
        name: catForm.name.trim(),
        code: catForm.code || catForm.name.substring(0, 4).toUpperCase(),
        section: catForm.section || 'Wing A',
        description: catForm.description || `${catForm.name} books and references`
      });

      if (res?.success) {
        Swal.fire({
          title: 'Category Added!',
          text: `"${catForm.name}" created.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsAddingCategory(false);
        setCatForm({ name: '', code: '', section: 'Wing A', description: '' });
        fetchCategories();
        fetchStats();
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to save category',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, name) => {
    const confirm = await Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to remove "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (confirm.isConfirmed) {
      try {
        const res = await libraryService.deleteCategory(id);
        if (res?.success) {
          fetchCategories();
          fetchStats();
        }
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to delete', icon: 'error', customClass: { popup: 'rounded-2xl' } });
      }
    }
  };

  // Book Request Status Update
  const handleUpdateRequestStatus = async (id, newStatus) => {
    try {
      const res = await libraryService.updateRequestStatus(id, newStatus);
      if (res?.success) {
        Swal.fire({
          title: `Status: ${newStatus}`,
          text: `Request updated to ${newStatus}.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        fetchRequests();
        fetchStats();
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', customClass: { popup: 'rounded-2xl' } });
    }
  };

  // Raise Book Request
  const handleSaveRequest = async (e) => {
    e?.preventDefault();
    if (!reqForm.title.trim()) {
      Swal.fire({ title: 'Book Title Required', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    try {
      const res = await libraryService.addRequest({
        title: reqForm.title,
        author: reqForm.author || 'Various',
        isbn: reqForm.isbn,
        requestedBy: reqForm.requestedBy || 'Student Requester',
        requesterRole: reqForm.requesterRole,
        requesterClass: reqForm.requesterClass,
        reason: reqForm.reason,
        status: 'Pending'
      });

      if (res?.success) {
        Swal.fire({
          title: 'Request Logged!',
          text: 'New title requested for library procurement.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsAddingRequest(false);
        setReqForm({ title: '', author: '', isbn: '', requestedBy: '', requesterRole: 'Student', requesterClass: 'Class X', reason: 'Exam preparation' });
        fetchRequests();
        fetchStats();
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', customClass: { popup: 'rounded-2xl' } });
    }
  };

  // Export Inventory CSV
  const handleExportCSV = () => {
    const headers = 'TITLE,AUTHOR,ISBN,CATEGORY,QUANTITY,AVAILABLE,SHELF,RACK,PRICE\n';
    const rows = books.map(b => 
      `"${b.title || ''}","${b.author || ''}","${b.isbn || ''}","${b.category || ''}",${b.quantity || 0},${b.available || 0},"${b.shelfNumber || ''}","${b.rackNumber || ''}",${b.price || 0}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library_catalog_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filtered books
  const filteredBooks = books.filter(b => {
    const matchesSearch = (b.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.author?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.isbn?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered categories
  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.code?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Overdue Loans
  const overdueLoans = issuedBooks.filter(i => i.status === 'Overdue');
  const activeLoans = issuedBooks.filter(i => i.status === 'Issued' || i.status === 'Overdue');

  const renderTabs = () => {
    const tabs = [
      { name: 'Overview', icon: LayoutGrid },
      { name: 'Issue/Return Book', icon: ArrowLeftRight },
      { name: 'Manage Books', icon: Settings },
      { name: 'Categories', icon: Tags },
      { name: 'Book Requests', icon: FileText },
      { name: 'Guide', icon: HelpCircle },
    ];

    return (
      <div className="flex space-x-6 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setIsAdding(false);
                setIsAddingCategory(false);
                setIsAddingRequest(false);
              }}
              className={`pb-3 text-sm font-bold flex items-center whitespace-nowrap transition-colors border-b-2 ${
                isActive && !isAdding && !isAddingCategory && !isAddingRequest
                  ? 'border-[#5542f6] text-[#5542f6]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
              {tab.name === 'Book Requests' && stats.pendingRequests > 0 && (
                <span className="ml-2 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-extrabold">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // ADD BOOK SCREEN
  if (isAdding) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-800">New Book Acquisition</h1>
            <p className="text-xs text-gray-500 mt-1">
              Catalogue physical or digital books with automated Google Books metadata retrieval.
            </p>
          </div>
          <button 
            onClick={() => setIsAdding(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm"
          >
            ← Back to Catalog
          </button>
        </div>

        {renderTabs()}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100 flex items-center bg-[#fcfaff]">
            <Book className="w-4 h-4 text-[#5542f6] mr-2" />
            <h2 className="text-sm font-bold text-[#5542f6]">Book Metadata & Physical Copies</h2>
          </div>

          <div className="p-6">
            {/* Google Books Auto-Fill Bar */}
            <div className="bg-gradient-to-r from-[#f3f0ff] to-[#f9f8ff] border border-[#d6ccff] rounded-2xl p-4 mb-6 shadow-inner">
              <div className="flex items-center text-[#5542f6] font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Fill from Google Books (ISBN or Title)
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={isbnSearchInput}
                  onChange={(e) => setIsbnSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchGoogleBook()}
                  placeholder="Enter ISBN (e.g. 9780141036144) or Title (e.g. Wings of Fire, HC Verma)..."
                  className="flex-1 bg-white border border-[#d0d4e4] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#5542f6] focus:ring-2 focus:ring-[#5542f6]/20 font-medium"
                />
                <button 
                  type="button"
                  onClick={handleFetchGoogleBook}
                  disabled={fetchingIsbn}
                  className="px-6 bg-[#5542f6] hover:bg-[#4a3ae0] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  {fetchingIsbn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{fetchingIsbn ? 'Fetching...' : 'Fetch & Auto-Fill'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#6b7280] mt-2">
                Type an ISBN number or title, then click Fetch to automatically pull authors, publishers, covers, and descriptions.
              </p>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                    placeholder="e.g. Concepts of Physics"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={bookForm.category}
                    onChange={(e) => setBookForm({...bookForm, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-white font-medium"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(c => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700">Class Restriction</label>
                    <button
                      type="button"
                      onClick={() => setIsQuickAddClassOpen(true)}
                      className="text-[10px] font-bold text-[#5542f6] hover:underline"
                    >
                      + Add Class
                    </button>
                  </div>
                  <select 
                    value={bookForm.classRestriction}
                    onChange={(e) => setBookForm({...bookForm, classRestriction: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-white font-medium"
                  >
                    <option value="All Classes">All Classes (General Circulation)</option>
                    {classesList.map(c => (
                      <option key={c._id || c.className} value={c.className}>
                        {c.className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Author</label>
                  <input 
                    type="text" 
                    value={bookForm.author}
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                    placeholder="e.g. Dr. H.C. Verma"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Publisher</label>
                  <input 
                    type="text" 
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({...bookForm, publisher: e.target.value})}
                    placeholder="e.g. Bharati Bhawan"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">ISBN Number</label>
                  <input 
                    type="text" 
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                    placeholder="e.g. 978-8177091878"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Publication Year</label>
                  <input 
                    type="number" 
                    value={bookForm.publishedYear}
                    onChange={(e) => setBookForm({...bookForm, publishedYear: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Edition</label>
                  <input 
                    type="text" 
                    value={bookForm.edition}
                    onChange={(e) => setBookForm({...bookForm, edition: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Language</label>
                  <input 
                    type="text" 
                    value={bookForm.language}
                    onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Page Count</label>
                  <input 
                    type="number" 
                    value={bookForm.pageCount}
                    onChange={(e) => setBookForm({...bookForm, pageCount: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Shelf Number</label>
                  <input 
                    type="text" 
                    value={bookForm.shelfNumber}
                    onChange={(e) => setBookForm({...bookForm, shelfNumber: e.target.value})}
                    placeholder="Shelf S-01"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Rack Number</label>
                  <input 
                    type="text" 
                    value={bookForm.rackNumber}
                    onChange={(e) => setBookForm({...bookForm, rackNumber: e.target.value})}
                    placeholder="Rack 12"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Copies (Qty) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={bookForm.quantity}
                    onChange={(e) => setBookForm({...bookForm, quantity: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Replacement Price (₹)</label>
                  <input 
                    type="number" 
                    value={bookForm.price}
                    onChange={(e) => setBookForm({...bookForm, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description & Synopsis</label>
                <textarea 
                  rows={3}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                  placeholder="Summary of topics covered, syllabus relevance, or library notes..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Image URL</label>
                <input 
                  type="text" 
                  value={bookForm.coverUrl}
                  onChange={(e) => setBookForm({...bookForm, coverUrl: e.target.value})}
                  placeholder="https://... (or auto-filled from Google Books)"
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center">
                <input 
                  type="checkbox" 
                  id="digitalCheckbox"
                  checked={bookForm.isDigital}
                  onChange={(e) => setBookForm({...bookForm, isDigital: e.target.checked})}
                  className="w-4 h-4 text-[#5542f6] border-gray-300 rounded mr-2" 
                />
                <label htmlFor="digitalCheckbox" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Digital E-Book / PDF Resource Available
                </label>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold hover:bg-gray-100 shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#f39c12] hover:bg-[#e67e22] text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save & Catalogue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Library Management System</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time campus circulation desk, physical barcode tracking, and automated overdue dues.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm transition-all"
          >
            <FileDown className="w-4 h-4 mr-2 text-gray-500" /> Export Inventory
          </button>
          <button 
            onClick={() => setBarcodeModalOpen(true)}
            className="flex items-center px-4 py-2 border border-indigo-200 text-[#5542f6] bg-indigo-50/70 hover:bg-indigo-100 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <ScanBarcode className="w-4 h-4 mr-2" /> Barcode Labels
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-[#f39c12] text-white rounded-xl text-xs font-bold hover:bg-[#e67e22] shadow-md shadow-amber-200 transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Acquisition
          </button>
        </div>
      </div>

      {renderTabs()}

      {/* ==============================================================
          TAB 1: ISSUE / RETURN CIRCULATION DESK
          ============================================================== */}
      {activeTab === 'Issue/Return Book' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Issue Book Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center bg-[#fcfaff]">
                <ArrowLeftRight className="w-4 h-4 text-[#5542f6] mr-2" />
                <h3 className="text-sm font-bold text-[#5542f6]">Issue a Book (Circulation Loan)</h3>
              </div>
              <form onSubmit={handleIssueBook} className="p-6 flex flex-col gap-4 text-xs font-bold text-gray-700">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Select Member (Student / Staff) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-normal">{members.length} registered</span>
                  </div>
                  <select 
                    required
                    value={issueForm.memberId}
                    onChange={(e) => {
                      const m = members.find(mem => mem.id === e.target.value);
                      setIssueForm({
                        ...issueForm,
                        memberId: e.target.value,
                        memberName: m ? m.name : '',
                        memberPhone: m ? m.phone : '',
                        memberType: m ? m.type : 'Student'
                      });
                    }}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-700 outline-none focus:border-[#5542f6] bg-white font-medium"
                  >
                    <option value="">-- Choose Student or Teacher --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} [{m.type}] — {m.subtitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">
                      Search Book from Library <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {books.filter(b => b.available > 0).length} Available for loan
                    </span>
                  </div>
                  <select 
                    required
                    value={issueForm.bookId}
                    onChange={(e) => setIssueForm({...issueForm, bookId: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-700 outline-none focus:border-[#5542f6] bg-white font-medium"
                  >
                    <option value="">-- Choose an Available Title --</option>
                    {books.map(b => (
                      <option key={b._id} value={b._id} disabled={b.available <= 0}>
                        {b.title} by {b.author} ({b.available}/{b.quantity} copies available) {b.available <= 0 ? '[OUT OF STOCK]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Issue Date</label>
                    <input 
                      type="text" 
                      value={new Date().toLocaleDateString('en-GB')} 
                      readOnly 
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-600 bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Borrow Duration</label>
                    <select 
                      value={issueForm.days}
                      onChange={(e) => setIssueForm({...issueForm, days: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-700 outline-none focus:border-[#5542f6] bg-white font-medium"
                    >
                      <option value={7}>7 Days (1 Week)</option>
                      <option value={14}>14 Days (Standard 2 Weeks)</option>
                      <option value={21}>21 Days (3 Weeks)</option>
                      <option value={30}>30 Days (1 Month - Staff)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="bg-[#5542f6] hover:bg-[#4a3ae0] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center shadow-md shadow-indigo-200 transition-all"
                  >
                    <Check className="w-4 h-4 mr-2" /> Issue Book Now
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Return Book Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfaff]">
                <div className="flex items-center">
                  <RotateCcw className="w-4 h-4 text-[#5542f6] mr-2" />
                  <h3 className="text-sm font-bold text-[#5542f6]">Return a Book</h3>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {activeLoans.length} active loans
                </span>
              </div>
              <div className="p-6 flex flex-col gap-4 text-xs font-bold text-gray-700">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Filter by Borrowing Member
                  </label>
                  <select 
                    value={selectedReturnMemberId}
                    onChange={(e) => setSelectedReturnMemberId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-700 outline-none focus:border-[#5542f6] bg-white font-medium"
                  >
                    <option value="">-- All Members with Borrowed Books --</option>
                    {Array.from(new Set(activeLoans.map(i => i.memberId))).map(mId => {
                      const loan = activeLoans.find(i => i.memberId === mId);
                      return (
                        <option key={mId} value={mId}>
                          {loan?.memberName} ({loan?.memberType})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* List of active loans */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {activeLoans.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 font-normal">
                      No active loans. All catalogued books are currently present on shelves!
                    </div>
                  ) : activeLoans
                      .filter(loan => !selectedReturnMemberId || loan.memberId === selectedReturnMemberId)
                      .map(loan => (
                        <div 
                          key={loan._id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                            loan.status === 'Overdue' 
                              ? 'bg-rose-50/60 border-rose-200 text-rose-900' 
                              : 'bg-slate-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs">{loan.book?.title || 'Book Title'}</div>
                            <div className="text-[11px] text-gray-500 font-normal">
                              Borrowed by <span className="font-semibold text-gray-800">{loan.memberName}</span> · Due: {new Date(loan.dueDate).toLocaleDateString('en-GB')}
                            </div>
                            {loan.status === 'Overdue' && (
                              <div className="text-[10px] text-rose-600 font-extrabold mt-0.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> OVERDUE — Fine ₹{loan.fineAmount || 50}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleReturnBook(loan._id, loan.book?.title, loan.memberName)}
                            className="px-3 py-1.5 bg-[#5542f6] hover:bg-[#4a3ae0] text-white rounded-lg text-xs font-bold shrink-0 transition-all shadow-xs"
                          >
                            Return
                          </button>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* Circulation History Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfaff]">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-[#5542f6] mr-2" />
                <h3 className="text-sm font-bold text-[#5542f6]">Recent Circulation History</h3>
              </div>
              <span className="text-xs text-gray-500 font-bold">{issuedBooks.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f3f0ff] text-[#5542f6]">
                    <th className="p-3 font-bold border-r border-white w-[30%]">BOOK TITLE</th>
                    <th className="p-3 font-bold border-r border-white w-[25%]">MEMBER</th>
                    <th className="p-3 font-bold border-r border-white w-[15%]">ISSUE DATE</th>
                    <th className="p-3 font-bold border-r border-white w-[15%]">DUE DATE</th>
                    <th className="p-3 font-bold border-r border-white">FINE</th>
                    <th className="p-3 font-bold text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {issuedBooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-400">
                        No circulation transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    issuedBooks.slice(0, 15).map(issue => (
                      <tr key={issue._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 font-bold text-gray-800">
                          {issue.book?.title || 'Book Title'}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            ISBN: {issue.book?.isbn || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700">
                          <span className="font-semibold">{issue.memberName}</span>
                          <span className="block text-[10px] text-gray-400">
                            {issue.memberType}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 font-mono">
                          {new Date(issue.issueDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="p-3 text-gray-600 font-mono">
                          {new Date(issue.dueDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          {issue.fineAmount > 0 ? (
                            <span className="text-rose-600">₹{issue.fineAmount}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            issue.status === 'Overdue' 
                              ? 'bg-rose-100 text-rose-700' 
                              : issue.status === 'Issued' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'Categories' ? (
        /* ==============================================================
           TAB 2: BOOK CATEGORIES
           ============================================================== */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 font-medium">
              Manage shelves, sections, and Dewey-decimal taxonomy for your library catalogue.
            </div>
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="bg-[#5542f6] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#4a3ae0] flex items-center shadow-md shadow-indigo-200 transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add New Category
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfaff]">
              <div className="flex items-center">
                <Tags className="w-4 h-4 text-[#5542f6] mr-2" />
                <h3 className="text-sm font-bold text-[#5542f6]">Library Categories Directory</h3>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Filter categories..." 
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs outline-none focus:border-[#5542f6] bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f3f0ff] text-[#5542f6]">
                    <th className="p-3 font-bold border-r border-white w-12 text-center">#</th>
                    <th className="p-3 font-bold border-r border-white">CATEGORY NAME</th>
                    <th className="p-3 font-bold border-r border-white w-24">CODE</th>
                    <th className="p-3 font-bold border-r border-white w-32">LOCATION</th>
                    <th className="p-3 font-bold border-r border-white w-24 text-center">TOTAL TITLES</th>
                    <th className="p-3 font-bold text-center w-20">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-400">No categories found.</td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat, idx) => (
                      <tr key={cat._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 text-center text-gray-400 font-bold">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold text-gray-800">{cat.name}</div>
                          <div className="text-[11px] text-gray-400 font-normal">{cat.description}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#5542f6]">{cat.code}</td>
                        <td className="p-3 text-gray-600 font-medium">{cat.section || 'Wing A'}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-indigo-50 text-[#5542f6] rounded-md font-extrabold text-xs">
                            {cat.booksCount || 0}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Category Modal */}
          {isAddingCategory && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
                <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <Tags className="w-5 h-5 text-white" />
                    <h3 className="font-black text-base">Add Book Category</h3>
                  </div>
                  <button onClick={() => setIsAddingCategory(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs font-bold text-gray-700">
                  <div>
                    <label className="block mb-1.5">Category Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Artificial Intelligence & Robotics" 
                      value={catForm.name}
                      onChange={(e) => setCatForm({...catForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5">Short Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. AI-ROB" 
                        value={catForm.code}
                        onChange={(e) => setCatForm({...catForm, code: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">Wing / Section</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Tech Corner" 
                        value={catForm.section}
                        onChange={(e) => setCatForm({...catForm, section: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5">Description</label>
                    <textarea 
                      rows={2}
                      placeholder="Scope of literature in this category..."
                      value={catForm.description}
                      onChange={(e) => setCatForm({...catForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white resize-none"
                    />
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingCategory(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-[#5542f6] text-white rounded-xl text-xs font-bold hover:bg-[#4a3ae0] shadow-md shadow-indigo-200"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'Manage Books' ? (
        /* ==============================================================
           TAB 3: MANAGE BOOKS
           ============================================================== */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfaff]">
              <div className="flex items-center">
                <Book className="w-4 h-4 text-[#5542f6] mr-2" />
                <h3 className="text-sm font-bold text-[#5542f6]">Catalogue Inventory ({books.length} Titles)</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold bg-white outline-none focus:border-[#5542f6]"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, ISBN..." 
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs outline-none focus:border-[#5542f6] bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f3f0ff] text-[#5542f6]">
                    <th className="p-3 font-bold border-r border-white w-12 text-center">#</th>
                    <th className="p-3 font-bold border-r border-white w-14 text-center">COVER</th>
                    <th className="p-3 font-bold border-r border-white w-[30%]">TITLE & DETAILS</th>
                    <th className="p-3 font-bold border-r border-white w-[20%]">AUTHOR & PUBLISHER</th>
                    <th className="p-3 font-bold border-r border-white w-[15%]">CATEGORY</th>
                    <th className="p-3 font-bold border-r border-white text-center w-20">LOCATION</th>
                    <th className="p-3 font-bold border-r border-white text-center w-16">TOTAL</th>
                    <th className="p-3 font-bold border-r border-white text-center w-20">AVAILABLE</th>
                    <th className="p-3 font-bold text-center w-20">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="9" className="p-6 text-center font-bold text-gray-400">Loading catalog...</td></tr>
                  ) : filteredBooks.length === 0 ? (
                    <tr><td colSpan="9" className="p-6 text-center text-gray-400">No books found matching query.</td></tr>
                  ) : (
                    filteredBooks.map((book, idx) => (
                      <tr key={book._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 text-center text-gray-400 font-bold">{idx + 1}</td>
                        <td className="p-3 text-center">
                          {book.coverUrl ? (
                            <img 
                              src={book.coverUrl} 
                              alt={book.title} 
                              className="w-8 h-11 object-cover rounded shadow-xs mx-auto"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-8 h-11 bg-indigo-600 text-white font-black text-xs rounded flex items-center justify-center mx-auto shadow-xs">
                              {book.title?.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-gray-800 text-xs">{book.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">ISBN: {book.isbn || '—'}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-gray-800 font-semibold">{book.author || 'Unknown'}</div>
                          <div className="text-[10px] text-gray-400">{book.publisher || '—'}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {book.category}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-600 font-mono text-[11px]">
                          {book.shelfNumber || 'Shelf A'}
                        </td>
                        <td className="p-3 text-center font-bold text-gray-700">{book.quantity}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            book.available > 0 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {book.available} left
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-gray-400">
                            <button 
                              onClick={() => setViewingBook(book)} 
                              className="p-1 hover:text-[#5542f6] rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBook(book._id, book.title)} 
                              className="p-1 hover:text-red-500 rounded"
                              title="Remove Book"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'Book Requests' ? (
        /* ==============================================================
           TAB 4: BOOK REQUESTS
           ============================================================== */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 font-medium">
              Titles requested by teachers, students, and parents for curriculum and recreational reading.
            </div>
            <button 
              onClick={() => setIsAddingRequest(true)}
              className="bg-[#5542f6] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#4a3ae0] flex items-center shadow-md shadow-indigo-200 transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Book Request
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfaff]">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-[#5542f6] mr-2" />
                <h3 className="text-sm font-bold text-[#5542f6]">Procurement & Acquisition Queue</h3>
              </div>
              <span className="text-xs font-bold text-gray-500">{requests.length} requests</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f3f0ff] text-[#5542f6]">
                    <th className="p-3 font-bold border-r border-white">REQUESTED BOOK</th>
                    <th className="p-3 font-bold border-r border-white w-[25%]">REQUESTED BY</th>
                    <th className="p-3 font-bold border-r border-white w-[15%]">DATE</th>
                    <th className="p-3 font-bold border-r border-white w-24 text-center">STATUS</th>
                    <th className="p-3 font-bold text-center w-36">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-400">
                        No book requests logged in the queue.
                      </td>
                    </tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-gray-800 text-xs">{req.title}</div>
                          <div className="text-[11px] text-gray-500">by {req.author || 'Unknown author'}</div>
                          {req.reason && (
                            <div className="text-[10px] text-gray-400 italic mt-0.5">"{req.reason}"</div>
                          )}
                        </td>
                        <td className="p-3 text-gray-700">
                          <div className="font-semibold">{req.requestedBy}</div>
                          <div className="text-[10px] text-gray-400">
                            {req.requesterRole} · {req.requesterClass || 'General'}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600 font-mono text-[11px]">
                          {new Date(req.requestDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                            req.status === 'Procured' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {req.status !== 'Approved' && req.status !== 'Procured' && (
                              <button
                                onClick={() => handleUpdateRequestStatus(req._id, 'Approved')}
                                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {req.status === 'Approved' && (
                              <button
                                onClick={() => handleUpdateRequestStatus(req._id, 'Procured')}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold"
                              >
                                Mark Procured
                              </button>
                            )}
                            {req.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateRequestStatus(req._id, 'Rejected')}
                                className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-bold"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Request Modal */}
          {isAddingRequest && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
                <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-white" />
                    <h3 className="font-black text-base">Request a Book Title</h3>
                  </div>
                  <button onClick={() => setIsAddingRequest(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveRequest} className="p-6 space-y-4 text-xs font-bold text-gray-700">
                  <div>
                    <label className="block mb-1.5">Book Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. S.L. Loney Plane Trigonometry" 
                      value={reqForm.title}
                      onChange={(e) => setReqForm({...reqForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5">Author</label>
                      <input 
                        type="text" 
                        placeholder="e.g. S.L. Loney" 
                        value={reqForm.author}
                        onChange={(e) => setReqForm({...reqForm, author: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">ISBN (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="978-..." 
                        value={reqForm.isbn}
                        onChange={(e) => setReqForm({...reqForm, isbn: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5">Requester Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Aarav Sharma" 
                        value={reqForm.requestedBy}
                        onChange={(e) => setReqForm({...reqForm, requestedBy: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">Class / Role</label>
                      <select 
                        value={reqForm.requesterClass}
                        onChange={(e) => setReqForm({...reqForm, requesterClass: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-white font-medium"
                      >
                        {classesList.map(c => (
                          <option key={c._id || c.className} value={c.className}>{c.className}</option>
                        ))}
                        <option value="Staff / Faculty">Staff / Faculty</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5">Reason for Request</label>
                    <textarea 
                      rows={2}
                      placeholder="Why is this title needed? (e.g. JEE/NEET prep, English literature review)"
                      value={reqForm.reason}
                      onChange={(e) => setReqForm({...reqForm, reason: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-[#5542f6] bg-slate-50 focus:bg-white resize-none"
                    />
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingRequest(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-[#5542f6] text-white rounded-xl text-xs font-bold hover:bg-[#4a3ae0] shadow-md shadow-indigo-200"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'Guide' ? (
        /* ==============================================================
           TAB 5: GUIDE
           ============================================================== */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-800 mb-2">How the Library Module Works</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              This module operates your institution's library as a <strong>live catalog plus a real-time circulation desk</strong>. You register books (supported by automated Google Books ISBN scraping), issue copies to students and staff with smart due date monitoring, compute overdue fines at ₹5/day, and process requests from students or parents directly into procurement.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h3 className="text-sm font-bold text-[#5542f6] mb-4">Complete Circulation Lifecycle</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 flex flex-col items-center text-center">
                <Tags className="w-6 h-6 text-[#5542f6] mb-2" />
                <div className="font-bold text-xs text-gray-800">1. Categories</div>
                <div className="text-[11px] text-gray-500 mt-1">Define shelves, wings, and dewey-decimal sections.</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 flex flex-col items-center text-center">
                <ScanBarcode className="w-6 h-6 text-indigo-600 mb-2" />
                <div className="font-bold text-xs text-gray-800">2. ISBN Fetch & Catalogue</div>
                <div className="text-[11px] text-gray-500 mt-1">One-click auto-fill from Google Books API.</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 flex flex-col items-center text-center">
                <ArrowLeftRight className="w-6 h-6 text-[#3498db] mb-2" />
                <div className="font-bold text-xs text-gray-800">3. Issue & Return</div>
                <div className="text-[11px] text-gray-500 mt-1">Real-time book availability and member loans.</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 flex flex-col items-center text-center">
                <Clock className="w-6 h-6 text-rose-600 mb-2" />
                <div className="font-bold text-xs text-gray-800">4. Overdue Dues & Fines</div>
                <div className="text-[11px] text-gray-500 mt-1">Automatic fine accounting and student notifications.</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==============================================================
           TAB 6: OVERVIEW (DEFAULT)
           ============================================================== */
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
                <span className="flex items-center gap-1.5"><Book className="w-4 h-4 text-[#5542f6]" /> TOTAL BOOKS</span>
                <span className="text-emerald-600 font-extrabold">{stats.totalTitles} Titles</span>
              </div>
              <div className="text-3xl font-black text-gray-800 mt-2">{stats.totalCopies || books.length}</div>
              <div className="text-[11px] text-gray-400 mt-1">{stats.availableCopies} available on shelves</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
                <span className="flex items-center gap-1.5"><ArrowLeftRight className="w-4 h-4 text-indigo-600" /> ISSUED BOOKS</span>
                <span className="text-indigo-600 font-extrabold">Active</span>
              </div>
              <div className="text-3xl font-black text-gray-800 mt-2">{activeLoans.length}</div>
              <div className="text-[11px] text-gray-400 mt-1">Currently in circulation</div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5 flex flex-col justify-between bg-gradient-to-br from-white to-rose-50/40">
              <div className="flex items-center justify-between text-rose-600 text-xs font-bold">
                <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> OVERDUE RETURNS</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                  {overdueLoans.length > 0 ? 'CRITICAL' : 'ALL CLEAR'}
                </span>
              </div>
              <div className="text-3xl font-black text-rose-600 mt-2">{overdueLoans.length}</div>
              <div className="text-[11px] text-rose-500 mt-1">Exceeded due return dates</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-amber-500" /> BOOK REQUESTS</span>
                <span className="text-amber-600 font-extrabold">{stats.pendingRequests} Pending</span>
              </div>
              <div className="text-3xl font-black text-gray-800 mt-2">{requests.length}</div>
              <div className="text-[11px] text-gray-400 mt-1">Awaiting procurement</div>
            </div>
          </div>

          {/* Main Grid: Catalog Table & Overdue Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Catalog List */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfaff]">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#5542f6]" /> Library Catalog
                </h2>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..." 
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs outline-none focus:border-[#5542f6] bg-white font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1a233a] text-white">
                      <th className="p-3 font-bold w-[40%]">BOOK TITLE</th>
                      <th className="p-3 font-bold w-[25%]">AUTHOR</th>
                      <th className="p-3 font-bold">CATEGORY</th>
                      <th className="p-3 font-bold">COPIES</th>
                      <th className="p-3 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan="5" className="p-6 text-center text-gray-400 font-bold">Loading catalog...</td></tr>
                    ) : filteredBooks.length === 0 ? (
                      <tr><td colSpan="5" className="p-6 text-center text-gray-400">No books found.</td></tr>
                    ) : (
                      filteredBooks.slice(0, 8).map(book => (
                        <tr key={book._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {book.coverUrl ? (
                                <img 
                                  src={book.coverUrl} 
                                  alt={book.title} 
                                  className="w-7 h-10 object-cover rounded shadow-xs shrink-0" 
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-7 h-10 bg-indigo-600 text-white font-black text-xs rounded flex items-center justify-center shrink-0">
                                  {book.title?.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-gray-800 text-xs">{book.title}</div>
                                <div className="text-[10px] text-gray-400 font-mono">ISBN: {book.isbn || '—'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-gray-800">{book.author}</div>
                            <div className="text-[10px] text-gray-400">{book.publisher || '—'}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {book.category}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${book.available > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{book.available} / {book.quantity}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setIssueForm(prev => ({ ...prev, bookId: book._id }));
                                setActiveTab('Issue/Return Book');
                              }}
                              className="px-2.5 py-1 bg-indigo-50 text-[#5542f6] hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all"
                            >
                              Issue
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar: Overdue Alerts & Circulation Trends */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Overdue Alerts Box */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-rose-600 font-black text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    Overdue Alerts
                  </div>
                  <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                    {overdueLoans.length} CRITICAL
                  </span>
                </div>

                {overdueLoans.length === 0 ? (
                  <div className="bg-white rounded-xl border border-rose-100 p-4 text-center text-xs text-gray-500">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                    No overdue books! All student and faculty loans are on schedule.
                  </div>
                ) : (
                  overdueLoans.slice(0, 3).map(loan => (
                    <div key={loan._id} className="bg-white rounded-xl border border-rose-200 p-3.5 mb-2.5 shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-extrabold text-gray-800 text-xs">{loan.memberName}</div>
                          <div className="text-[11px] text-gray-500 italic mt-0.5">"{loan.book?.title}"</div>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          FINE ₹{loan.fineAmount || 50}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        Due: {new Date(loan.dueDate).toLocaleDateString('en-GB')}
                      </div>
                      <button 
                        onClick={() => {
                          Swal.fire({
                            title: 'Notification Dispatched!',
                            text: `SMS & App Reminder sent to ${loan.memberName} regarding overdue book "${loan.book?.title}".`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            customClass: { popup: 'rounded-2xl' }
                          });
                        }}
                        className="w-full mt-2.5 bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Notify Student / Parent
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Circulation Trends Chart */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-extrabold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-[#5542f6]" /> Weekly Circulation
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">Active Campus Desk</span>
                </div>

                <div className="flex-1 flex flex-col justify-end pt-4">
                  <div className="flex items-end justify-between h-32 border-b border-l border-gray-200 pb-1 pl-2 relative">
                    <div className="w-[11%] h-[60%] bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-all cursor-pointer" title="Mon: 12 loans" />
                    <div className="w-[11%] h-[85%] bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-all cursor-pointer" title="Tue: 18 loans" />
                    <div className="w-[11%] h-[40%] bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-all cursor-pointer" title="Wed: 8 loans" />
                    <div className="w-[11%] h-[100%] bg-indigo-600 rounded-t-sm shadow-xs hover:bg-indigo-700 transition-all cursor-pointer" title="Thu: 24 loans (Peak Day)" />
                    <div className="w-[11%] h-[75%] bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-all cursor-pointer" title="Fri: 15 loans" />
                    <div className="w-[11%] h-[30%] bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-all cursor-pointer" title="Sat: 6 loans" />
                    <div className="w-[11%] h-[10%] bg-gray-200 rounded-t-sm" title="Sun: Closed" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-extrabold mt-2 px-1">
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==============================================================
          MODAL: VIEW BOOK DETAILS
          ============================================================== */}
      {viewingBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="font-black text-base">Book Specifications</h3>
              </div>
              <button onClick={() => setViewingBook(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                {viewingBook.coverUrl ? (
                  <img src={viewingBook.coverUrl} alt={viewingBook.title} className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0" />
                ) : (
                  <div className="w-20 h-28 bg-indigo-600 text-white font-black text-2xl rounded-xl flex items-center justify-center shrink-0">
                    {viewingBook.title?.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-black text-gray-900 text-base leading-snug">{viewingBook.title}</h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Author: {viewingBook.author}</p>
                  <p className="text-xs text-gray-500">Publisher: {viewingBook.publisher || 'N/A'}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700">
                    {viewingBook.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-gray-200">
                <div><span className="text-gray-400">ISBN:</span> <span className="font-mono font-bold text-gray-800">{viewingBook.isbn || '—'}</span></div>
                <div><span className="text-gray-400">Shelf & Rack:</span> <span className="font-bold text-gray-800">{viewingBook.shelfNumber || 'Shelf A'} / {viewingBook.rackNumber || 'Rack 1'}</span></div>
                <div><span className="text-gray-400">Total Copies:</span> <span className="font-bold text-gray-800">{viewingBook.quantity}</span></div>
                <div><span className="text-gray-400">Available:</span> <span className="font-bold text-emerald-600">{viewingBook.available}</span></div>
                <div><span className="text-gray-400">Replacement Cost:</span> <span className="font-bold text-gray-800">₹{viewingBook.price || 450}</span></div>
                <div><span className="text-gray-400">Edition / Year:</span> <span className="font-bold text-gray-800">{viewingBook.edition || '1st'} ({viewingBook.publishedYear || 2024})</span></div>
              </div>

              {viewingBook.description && (
                <div>
                  <div className="text-xs font-bold text-gray-700 mb-1">Synopsis</div>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {viewingBook.description}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingBook(null)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: PRINT BARCODE LABELS
          ============================================================== */}
      {barcodeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ScanBarcode className="w-5 h-5 text-white" />
                <h3 className="font-black text-base">Printable Library Barcode Labels</h3>
              </div>
              <button onClick={() => setBarcodeModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500">
                Standard spine stickers for physical library inventory scanning. Compatible with handheld laser barcode scanners.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-2 border border-dashed border-gray-300 rounded-2xl bg-slate-50">
                {books.map(b => (
                  <div key={b._id} className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-2xs font-mono">
                    <div className="text-[10px] font-bold text-gray-800 truncate">{b.title}</div>
                    <div className="my-2 bg-gray-900 text-white text-[9px] py-1 px-2 tracking-widest font-black uppercase rounded">
                      ||| | |||| | |||
                    </div>
                    <div className="text-[9px] text-gray-500 font-bold">{b.isbn || 'LIB-2026-001'}</div>
                    <div className="text-[8px] text-indigo-600 font-bold">{b.shelfNumber || 'Shelf A'}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setBarcodeModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-bold hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-md shadow-indigo-200"
                >
                  <Printer className="w-4 h-4" /> Print Barcode Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Class Modal integration */}
      <QuickAddClassModal 
        isOpen={isQuickAddClassOpen}
        onClose={() => setIsQuickAddClassOpen(false)}
        onClassAdded={async () => {
          fetchMembersAndClasses();
        }}
      />
    </div>
  );
}
