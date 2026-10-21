import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Paperclip, Send, Search, Phone, MoreVertical, Trash2, 
  Check, CheckCheck, RefreshCw, Users, User, MessageCircle, AlertCircle, 
  Pin, Share2, Globe, Clock, ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import messageService from '../api/messageService';

const Messages = () => {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'groups' | 'direct'

  // Message Input
  const [inputText, setInputText] = useState('');
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(false);
  const messagesEndRef = useRef(null);

  // New Conversation Modal
  const [isComposing, setIsComposing] = useState(false);
  const [composeTab, setComposeTab] = useState('contacts'); // 'contacts' | 'classes' | 'direct'
  const [contacts, setContacts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [loadingModalData, setLoadingModalData] = useState(false);

  // Direct Number Form
  const [directForm, setDirectForm] = useState({
    name: '',
    phone: '',
    role: 'Parent',
    initialMessage: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load Threads from MongoDB
  const loadThreads = async (selectThreadId = null) => {
    setLoadingThreads(true);
    try {
      const res = await messageService.getThreads();
      if (res?.data) {
        setThreads(res.data);
        if (selectThreadId) {
          const found = res.data.find(t => t.threadId === selectThreadId);
          if (found) setActiveThread(found);
        } else if (!activeThread && res.data.length > 0) {
          setActiveThread(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  // Load Messages for Active Thread
  const loadMessages = async (threadId) => {
    if (!threadId) return;
    setLoadingMessages(true);
    try {
      const res = await messageService.getThreadMessages(threadId);
      if (res?.data) {
        setMessages(res.data);
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeThread?.threadId) {
      loadMessages(activeThread.threadId);
    }
  }, [activeThread?.threadId]);

  // Periodic polling for active thread messages every 6 seconds
  useEffect(() => {
    if (!activeThread?.threadId) return;
    const interval = setInterval(async () => {
      try {
        const res = await messageService.getThreadMessages(activeThread.threadId);
        if (res?.data) {
          setMessages(res.data);
        }
      } catch (e) {
        // quiet background refresh
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [activeThread?.threadId]);

  // Real-time Socket.IO integration
  useEffect(() => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('solarpro_admin_token');

    if (!token) return;

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
      : 'http://localhost:5050';

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('new_message', (payload) => {
      const { threadId, message } = payload || {};

      if (!message || threadId !== activeThread?.threadId) return;

      setMessages((previous) => {
        const alreadyExists = previous.some(
          (item) => String(item._id) === String(message._id)
        );

        if (alreadyExists) return previous;

        return [...previous, message];
      });
      setTimeout(scrollToBottom, 50);
    });

    socket.on('connect_error', (error) => {
      console.warn('Chat socket connection note:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeThread?.threadId]);

  // Send Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeThread || sendingMessage) return;

    const messageContent = inputText.trim();
    setInputText('');
    setSendingMessage(true);

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      _id: tempId,
      threadId: activeThread.threadId,
      sender: 'You',
      senderRole: 'Teacher Admin',
      content: messageContent,
      isSelf: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 30);

    try {
      const res = await messageService.sendMessage(activeThread.threadId, {
        content: messageContent,
        sender: 'You',
        senderRole: 'Teacher Admin'
      });

      if (res?.data) {
        setMessages(prev => prev.map(m => m._id === tempId ? res.data : m));
      }

      // If user selected WhatsApp / SMS Alert, trigger real WhatsApp & Twilio SMS notification
      if (sendViaWhatsApp) {
        const targetPhone = activeThread.participants?.[0]?.phone || '919876543210';
        // WhatsApp dispatch
        try {
          await messageService.sendWhatsAppMessage({
            phone: targetPhone,
            recipientName: activeThread.name,
            senderName: 'Teacher Admin',
            content: messageContent,
            threadId: activeThread.threadId
          });
        } catch (waErr) {
          console.warn('WhatsApp alert dispatched note:', waErr.message);
        }

        // Live Twilio SMS dispatch
        try {
          await messageService.sendSMS({
            phone: targetPhone,
            recipientName: activeThread.name,
            content: messageContent,
            threadId: activeThread.threadId
          });
        } catch (smsErr) {
          console.warn('Twilio SMS alert dispatched note:', smsErr.message);
        }
      }

      // Update local thread last message
      setThreads(prev => prev.map(t => 
        t.threadId === activeThread.threadId 
          ? { ...t, lastMsg: messageContent, lastMsgAt: new Date() } 
          : t
      ));
    } catch (err) {
      Swal.fire({
        title: 'Message Not Delivered',
        text: err.response?.data?.message || err.message,
        icon: 'error'
      });
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } finally {
      setSendingMessage(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  // Delete single message
  const handleDeleteMessage = async (msgId) => {
    try {
      await messageService.deleteMessage(activeThread.threadId, msgId);
      setMessages(prev => prev.filter(m => m._id !== msgId));
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  // Clear thread history
  const handleClearHistory = async () => {
    if (!activeThread) return;
    const confirm = await Swal.fire({
      title: 'Clear Chat History?',
      text: `Remove all messages in "${activeThread.name}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Clear All',
      confirmButtonColor: '#dc2626'
    });

    if (confirm.isConfirmed) {
      try {
        await messageService.clearThreadHistory(activeThread.threadId);
        setMessages([]);
        setThreads(prev => prev.map(t => t.threadId === activeThread.threadId ? { ...t, lastMsg: '' } : t));
        Swal.fire({ title: 'Cleared', text: 'Chat history cleared.', icon: 'success' });
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    }
  };

  // Delete thread
  const handleDeleteThread = async (threadId, threadName) => {
    const confirm = await Swal.fire({
      title: 'Delete Conversation?',
      text: `Are you sure you want to delete "${threadName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626'
    });

    if (confirm.isConfirmed) {
      try {
        await messageService.deleteThread(threadId);
        const updated = threads.filter(t => t.threadId !== threadId);
        setThreads(updated);
        if (activeThread?.threadId === threadId) {
          setActiveThread(updated[0] || null);
        }
        Swal.fire({ title: 'Deleted', text: 'Conversation removed.', icon: 'success' });
      } catch (err) {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      }
    }
  };

  // Load Contacts & Classes when Opening Modal
  const handleOpenComposeModal = async () => {
    setIsComposing(true);
    setLoadingModalData(true);
    try {
      const [contactsRes, classesRes] = await Promise.all([
        messageService.getContacts(),
        messageService.getClasses()
      ]);
      if (contactsRes?.data) setContacts(contactsRes.data);
      if (classesRes?.data) setClasses(classesRes.data);
    } catch (err) {
      console.error('Error loading modal data:', err);
    } finally {
      setLoadingModalData(false);
    }
  };

  // Start chat with a Contact
  const handleStartContactChat = async (contact) => {
    try {
      const payload = {
        name: contact.name,
        role: contact.category === 'Parent' ? 'Parent / Guardian' : contact.role || 'Student',
        isGroup: false,
        avatar: contact.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        participants: [
          { name: contact.name, role: contact.role, phone: contact.phone, email: contact.email }
        ],
        initialMessage: `Hello ${contact.name}, starting conversation from Teacher portal.`
      };

      const res = await messageService.createThread(payload);
      setIsComposing(false);
      await loadThreads(res?.data?.threadId);
      Swal.fire({
        title: 'Conversation Started!',
        text: `Chat opened with ${contact.name}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  // Start chat with a Class Group
  const handleStartClassChat = async (cls) => {
    try {
      const payload = {
        name: `${cls.className} Class Group`,
        role: 'Class Group',
        isGroup: true,
        avatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=150',
        participants: [],
        initialMessage: `Class group conversation initiated for ${cls.className}.`
      };

      const res = await messageService.createThread(payload);
      setIsComposing(false);
      await loadThreads(res?.data?.threadId);
      Swal.fire({
        title: 'Group Created!',
        text: `Discussion group for ${cls.className} is now active.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  // Start Direct Chat with Phone Number
  const handleStartDirectChat = async (e) => {
    if (e) e.preventDefault();
    if (!directForm.name || !directForm.phone) {
      Swal.fire({ title: 'Required Fields', text: 'Please enter Name and Phone number', icon: 'warning' });
      return;
    }

    try {
      const payload = {
        name: directForm.name,
        role: `${directForm.role} (${directForm.phone})`,
        isGroup: false,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        participants: [
          { name: directForm.name, role: directForm.role, phone: directForm.phone }
        ],
        initialMessage: directForm.initialMessage || `Hello ${directForm.name}, this is your teacher contacting from School ERP.`
      };

      const res = await messageService.createThread(payload);
      setIsComposing(false);
      setDirectForm({ name: '', phone: '', role: 'Parent', initialMessage: '' });
      await loadThreads(res?.data?.threadId);
      Swal.fire({
        title: 'Direct Message Ready!',
        text: `Conversation created for ${directForm.name}.`,
        icon: 'success'
      });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  // Filter threads by search and tab
  const filteredThreads = threads.filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.lastMsg || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'groups' && t.isGroup) || 
                       (activeTab === 'direct' && !t.isGroup);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-50/50 theme-app-bg text-sm h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 md:px-8 bg-white border-b border-gray-200 shrink-0 flex justify-between items-center relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
        <div>
          <h1 className="text-[22px] font-black text-gray-800 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-600 flex items-center justify-center shadow-sm">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            School Communication & Live Messages
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time chat with parents, students, faculty, and official class groups.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => loadThreads(activeThread?.threadId)}
            className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Refresh Chats from MongoDB">
            <RefreshCw className={`w-4 h-4 ${loadingThreads ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <button 
            onClick={handleOpenComposeModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> New Conversation
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 flex-col md:flex-row gap-5 p-5 md:p-6 mx-auto w-full max-w-7xl overflow-hidden min-h-0">
           
           {/* Left Pane - Conversations List */}
           <div className="w-full md:w-[35%] bg-white border border-gray-300 rounded-none shadow-sm flex flex-col overflow-hidden h-full">
              
              {/* Search Bar */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search conversations..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                 </div>
                 {/* Tabs */}
                 <div className="flex gap-1 mt-2.5">
                    <button 
                      onClick={() => setActiveTab('all')}
                      className={`flex-1 py-1 text-[11px] font-bold uppercase transition-colors ${
                        activeTab === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}>
                      All ({threads.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('groups')}
                      className={`flex-1 py-1 text-[11px] font-bold uppercase transition-colors ${
                        activeTab === 'groups' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}>
                      Groups ({threads.filter(t => t.isGroup).length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('direct')}
                      className={`flex-1 py-1 text-[11px] font-bold uppercase transition-colors ${
                        activeTab === 'direct' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}>
                      Direct ({threads.filter(t => !t.isGroup).length})
                    </button>
                 </div>
              </div>
              
              {/* Threads List */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                 {filteredThreads.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400 font-bold">
                       No conversations found. Click "New Conversation" to start.
                    </div>
                 ) : (
                    filteredThreads.map((chat) => {
                       const isSelected = activeThread?.threadId === chat.threadId;
                       return (
                          <div 
                              key={chat.threadId} 
                              onClick={() => setActiveThread(chat)}
                              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors group border-l-[3px] ${
                                isSelected 
                                  ? 'border-purple-600 bg-purple-50/50 shadow-sm' 
                                  : 'border-transparent hover:bg-gray-50'
                              }`}>
                             <div className="relative shrink-0">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center font-black bg-purple-100 text-purple-700 border border-purple-200 text-sm overflow-hidden">
                                 {chat.avatar ? (
                                   <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                                 ) : (
                                   chat.name.charAt(0)
                                 )}
                                </div>
                                {chat.online && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></span>
                                )}
                             </div>

                             <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-center mb-0.5">
                                  <h3 className={`font-bold text-[13px] truncate ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                                    {chat.name}
                                  </h3>
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    {chat.lastMsgAt ? new Date(chat.lastMsgAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                  </span>
                               </div>
                               <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 uppercase border ${
                                    chat.isGroup ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                  }`}>
                                    {chat.role || 'Direct'}
                                  </span>
                               </div>
                               <p className="text-[12px] truncate text-gray-500 font-medium leading-relaxed">
                                 {chat.lastMsg || 'No messages yet'}
                               </p>
                             </div>

                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteThread(chat.threadId, chat.name);
                               }}
                               className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity p-1"
                               title="Delete thread">
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       );
                    })
                 )}
              </div>
           </div>

           {/* Right Pane - Chat Window */}
           <div className="w-full md:w-[65%] bg-white border border-gray-300 rounded-none shadow-sm flex flex-col overflow-hidden">
              {activeThread ? (
                 <div className="flex-1 flex flex-col h-full overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200 overflow-hidden">
                            {activeThread.avatar ? (
                              <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" />
                            ) : (
                              activeThread.name.charAt(0)
                            )}
                          </div>
                          <div>
                             <h2 className="font-bold text-gray-900 text-[14px] flex items-center gap-2">
                               {activeThread.name}
                               {activeThread.isGroup && (
                                 <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 font-bold uppercase">
                                   Group
                                 </span>
                               )}
                             </h2>
                             <p className="text-[11px] text-gray-500">
                               {activeThread.role} | {activeThread.online ? 'Online' : 'Offline'}
                             </p>
                          </div>
                       </div>

                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => loadMessages(activeThread.threadId)}
                            className="p-1.5 text-gray-500 hover:bg-gray-200 border border-gray-300 transition-colors"
                            title="Refresh Messages">
                            <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin text-purple-600' : ''}`} />
                          </button>
                          <button 
                            onClick={handleClearHistory}
                            className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                            title="Clear Chat History">
                            Clear Chat
                          </button>
                       </div>
                    </div>
                    
                    {/* Chat Messages Body */}
                    <div className="flex-1 overflow-y-auto p-5 bg-gray-50/40 space-y-3.5">
                       {messages.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs font-medium">
                            <MessageCircle className="w-8 h-8 text-gray-300 mb-2" />
                            No messages in this conversation yet. Send the first message below.
                         </div>
                       ) : (
                         messages.map(msg => {
                            const isOutgoing = msg.isSelf;
                            return (
                               <div key={msg._id} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} group animate-in fade-in duration-200`}>
                                  <div className="max-w-[80%] flex items-end gap-1.5">
                                     {isOutgoing && (
                                       <button 
                                         onClick={() => handleDeleteMessage(msg._id)}
                                         className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity p-1 mb-1"
                                         title="Delete message">
                                         <Trash2 className="w-3 h-3" />
                                       </button>
                                     )}

                                     <div className={`p-3 shadow-sm border ${
                                       isOutgoing 
                                         ? 'bg-purple-600 text-white border-purple-700 rounded-none' 
                                         : 'bg-white text-gray-800 border-gray-200 rounded-none'
                                     }`}>
                                        {!isOutgoing && (
                                          <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider mb-1">
                                            {msg.sender} {msg.senderRole && `(${msg.senderRole})`}
                                          </p>
                                        )}
                                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
                                          {msg.content}
                                        </p>
                                        <div className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${
                                          isOutgoing ? 'text-purple-200' : 'text-gray-400'
                                        }`}>
                                           <span>{msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                           {isOutgoing && <CheckCheck className="w-3 h-3 text-purple-200" />}
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            );
                         })
                       )}
                       <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSendMessage} className="p-3.5 border-t border-gray-200 bg-white flex flex-col gap-2 shrink-0">
                       <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold px-1">
                          <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                             <input 
                               type="checkbox" 
                               checked={sendViaWhatsApp}
                               onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                               className="text-purple-600 rounded-none focus:ring-purple-500"
                             />
                             <span>Also send official WhatsApp / SMS notification</span>
                          </label>
                          <span className="text-[10px] text-gray-400">Press Enter ↵ to Send</span>
                       </div>

                       <div className="flex gap-2 items-center">
                          <input 
                             type="text" 
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                             placeholder={`Type a message to ${activeThread.name}...`}
                             className="flex-1 bg-white border-2 border-gray-300 px-4 py-2 text-sm text-gray-800 outline-none focus:border-purple-600 transition-all font-medium"
                          />
                          <button 
                             type="submit"
                             disabled={sendingMessage || !inputText.trim()}
                             className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50">
                             <Send className="w-3.5 h-3.5" /> Send
                          </button>
                       </div>
                    </form>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                    <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                    <h3 className="font-bold text-gray-700 text-sm">No Conversation Selected</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">
                      Choose an existing thread from the left or click "New Conversation" to start a chat with parents, students, or classes.
                    </p>
                 </div>
              )}
           </div>

      </div>

      {/* New Conversation Modal */}
      {isComposing && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white max-w-xl w-full rounded-none shadow-2xl border border-gray-300 flex flex-col max-h-[85vh]">
               {/* Modal Header */}
               <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
                  <h2 className="font-black text-gray-800 text-[15px] uppercase tracking-tight flex items-center gap-2">
                     <Plus className="w-4 h-4 text-purple-600" /> Start New Conversation
                  </h2>
                  <button onClick={() => setIsComposing(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Modal Tabs */}
               <div className="px-6 pt-3 flex gap-2 border-b border-gray-200 bg-gray-100">
                  <button 
                    onClick={() => setComposeTab('contacts')}
                    className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
                      composeTab === 'contacts' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}>
                    School Contacts ({contacts.length})
                  </button>
                  <button 
                    onClick={() => setComposeTab('classes')}
                    className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
                      composeTab === 'classes' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}>
                    Class Groups ({classes.length})
                  </button>
                  <button 
                    onClick={() => setComposeTab('direct')}
                    className={`px-4 py-2 text-xs font-bold uppercase transition-colors border-b-2 ${
                      composeTab === 'direct' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}>
                    Direct Mobile / WhatsApp
                  </button>
               </div>
               
               {/* Modal Body */}
               <div className="p-6 flex-1 overflow-y-auto">
                  {composeTab === 'contacts' && (
                     <div className="space-y-4">
                        <div className="relative">
                           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input 
                             type="text" 
                             placeholder="Search parents or students by name/phone..." 
                             value={contactSearch}
                             onChange={(e) => setContactSearch(e.target.value)}
                             className="w-full pl-9 pr-3 py-2 text-xs border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                           />
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto">
                           {contacts
                             .filter(c => (c.name || '').toLowerCase().includes(contactSearch.toLowerCase()) || (c.phone || '').includes(contactSearch))
                             .map((c) => (
                               <div 
                                 key={c.id}
                                 onClick={() => handleStartContactChat(c)}
                                 className="p-3 border border-gray-200 hover:border-purple-400 hover:bg-purple-50/30 flex justify-between items-center cursor-pointer transition-all">
                                 <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                     {c.name.charAt(0)}
                                   </div>
                                   <div>
                                     <h4 className="font-bold text-gray-900 text-xs">{c.name}</h4>
                                     <p className="text-[11px] text-gray-500">{c.category || 'Member'} | 📞 {c.phone}</p>
                                   </div>
                                 </div>
                                 <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 border border-purple-200">
                                   Chat Now →
                                 </span>
                               </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {composeTab === 'classes' && (
                     <div className="space-y-2.5 max-h-80 overflow-y-auto">
                        {classes.map((cls) => (
                           <div 
                             key={cls._id}
                             onClick={() => handleStartClassChat(cls)}
                             className="p-3.5 border border-gray-200 hover:border-purple-500 hover:bg-purple-50/40 flex justify-between items-center cursor-pointer transition-all">
                             <div>
                                <h4 className="font-bold text-gray-900 text-sm">{cls.className}</h4>
                                <p className="text-xs text-gray-500 font-medium">Sections: {(cls.sections || ['A']).join(', ')} | Enrolled: {cls.enrolledCount || 0} students</p>
                             </div>
                             <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 border border-purple-200">
                                Create Group Chat →
                             </span>
                           </div>
                        ))}
                     </div>
                  )}

                  {composeTab === 'direct' && (
                     <form onSubmit={handleStartDirectChat} className="space-y-4">
                        <div>
                           <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Recipient Name *</label>
                           <input 
                             type="text" 
                             required
                             value={directForm.name}
                             onChange={(e) => setDirectForm(prev => ({ ...prev, name: e.target.value }))}
                             placeholder="e.g. Ramesh Patel"
                             className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile / WhatsApp *</label>
                              <input 
                                type="text" 
                                required
                                value={directForm.phone}
                                onChange={(e) => setDirectForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+91 9876543210"
                                className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Role / Relationship</label>
                              <select 
                                value={directForm.role}
                                onChange={(e) => setDirectForm(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none bg-white">
                                 <option value="Parent">Parent</option>
                                 <option value="Student">Student</option>
                                 <option value="Guardian">Guardian</option>
                              </select>
                           </div>
                        </div>
                        <div>
                           <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">First Message</label>
                           <textarea 
                             rows={3}
                             value={directForm.initialMessage}
                             onChange={(e) => setDirectForm(prev => ({ ...prev, initialMessage: e.target.value }))}
                             placeholder="Type introduction or announcement..."
                             className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"></textarea>
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                           <button 
                             type="button" 
                             onClick={() => setIsComposing(false)}
                             className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs uppercase">
                             Cancel
                           </button>
                           <button 
                             type="submit"
                             className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                             <Send className="w-3.5 h-3.5" /> Start Conversation
                           </button>
                        </div>
                     </form>
                  )}
               </div>
            </div>
         </div>
      )}
      
    </div>
  );
};

export default Messages;
