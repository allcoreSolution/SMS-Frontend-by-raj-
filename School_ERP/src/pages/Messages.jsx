import React, { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  MessageSquare, 
  MessageCircle, 
  Send, 
  Search, 
  Plus, 
  User, 
  Phone, 
  Check, 
  CheckCheck, 
  X, 
  RefreshCw, 
  Smile, 
  Trash2, 
  ArrowLeft, 
  QrCode, 
  Smartphone, 
  LogOut, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import messagesService from "../api/messagesService";

const EMOJI_PRESETS = ["👍", "📚", "✅", "👏", "🙏", "😊", "🎯", "📝", "👋", "🎓"];

const QUICK_TEMPLATES = [
  { label: "💳 Fee Reminder", text: "Dear Parent, this is a gentle reminder regarding pending school fees. Kindly clear the dues via the ERP portal or school office." },
  { label: "⚠️ Absent Alert", text: "Dear Parent, your child was marked absent today in school without prior notice. Please verify and inform the administration." },
  { label: "📚 Homework", text: "Dear Student, homework assignments have been uploaded to your ERP student portal. Please complete and submit on time." },
  { label: "📢 Exam Schedule", text: "Dear Parent, the upcoming Examination Date Sheet and Syllabus have been published on the school portal notice board." }
];

export default function Messages() {
  // ─── ADMIN WHATSAPP SESSION ───
  const [adminSession, setAdminSession] = useState({
    isConnected: false,
    phone: '',
    displayPhone: '',
    name: 'School Admin'
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState('qr'); // 'qr' | 'phone'
  const [inputPhone, setInputPhone] = useState('');
  const [inputAdminName, setInputAdminName] = useState('Super Admin');
  const [pairingCode, setPairingCode] = useState('');
  const [connecting, setConnecting] = useState(false);

  // ─── CHAT & THREADS ───
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'students' | 'parents' | 'staff'
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  // ─── DIRECT CHAT BY NUMBER MODAL ───
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [directForm, setDirectForm] = useState({
    phone: '',
    name: '',
    role: 'Parent'
  });
  const [startingChat, setStartingChat] = useState(false);

  const messagesEndRef = useRef(null);

  // ─── 1. LOAD WHATSAPP SESSION ───
  const fetchSession = useCallback(async () => {
    try {
      const res = await messagesService.getWhatsAppSession();
      if (res?.success && res.data) {
        setAdminSession(res.data);
      }
    } catch (err) {
      console.warn("Error fetching WhatsApp session:", err);
    }
  }, []);

  // ─── 2. LOAD THREADS ───
  const fetchThreads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await messagesService.getThreads({ search: searchQuery || undefined });
      if (res?.data) {
        setThreads(res.data);
        if (!activeThreadId && res.data.length > 0) {
          setActiveThreadId(res.data[0].threadId);
        }
      }
    } catch (err) {
      console.error("Error loading chat threads:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeThreadId]);

  // ─── 3. LOAD MESSAGES FOR ACTIVE THREAD ───
  const fetchMessages = useCallback(async (threadId) => {
    if (!threadId) return;
    setMessagesLoading(true);
    try {
      const res = await messagesService.getThreadMessages(threadId);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
    fetchThreads();
  }, [fetchSession, fetchThreads]);

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);
    }
  }, [activeThreadId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch Meta WhatsApp session when modal is opened
  useEffect(() => {
    if (showLoginModal) {
      fetchSession();
    }
  }, [showLoginModal, fetchSession]);

  // Active Thread Object
  const activeThread = threads.find(t => t.threadId === activeThreadId) || threads[0] || null;

  // Active Recipient Phone
  const activePhone = activeThread?.phone || activeThread?.participants?.[0]?.phone || '9876543210';

  const handleOpenChatInWhatsApp = (customText = '') => {
    let phone = (activePhone || '9876543210').replace(/[^0-9]/g, '');
    if (phone.length === 10) phone = '91' + phone;
    const msg = encodeURIComponent(customText || `Hello ${activeThread?.name || ''}, this is Greenwood School Administration.`);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
  };

  // ─── 4. CONNECT ADMIN WHATSAPP VIA PAIRING CODE ───
  const handleConnectWhatsApp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputPhone.trim()) {
      Swal.fire("Enter Number", "Please enter your WhatsApp mobile number to connect.", "warning");
      return;
    }

    setConnecting(true);
    try {
      const res = await messagesService.connectWhatsApp({
        phone: inputPhone.trim(),
        name: inputAdminName.trim() || 'Super Admin'
      });

      if (res?.data?.pairingCode) {
        setPairingCode(res.data.pairingCode);
        Swal.fire({
          icon: "info",
          title: `WhatsApp Code: ${res.data.pairingCode}`,
          html: `<p style="font-size:13px;line-height:1.6">1. Open WhatsApp on your phone.<br/>2. Tap <b>Linked Devices</b> &gt; <b>Link a device</b>.<br/>3. Tap <b>Link with phone number instead</b>.<br/>4. Enter code: <b style="font-size:20px;letter-spacing:3px;color:#00a884">${res.data.pairingCode}</b></p>`,
          confirmButtonColor: "#00a884"
        });
      } else {
        await fetchSession();
      }
    } catch (err) {
      Swal.fire("Connection Notice", err?.response?.data?.message || "Please scan the QR code to link device.", "info");
    } finally {
      setConnecting(false);
    }
  };

  // ─── 5. DISCONNECT ADMIN WHATSAPP ───
  const handleDisconnectWhatsApp = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Disconnect WhatsApp?",
      text: "Are you sure you want to log out your WhatsApp number?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Disconnect"
    });

    if (!isConfirmed) return;

    try {
      await messagesService.disconnectWhatsApp();
      setAdminSession({ isConnected: false, phone: '', displayPhone: '', name: 'School Admin' });
      Swal.fire({
        icon: "info",
        title: "Disconnected",
        text: "Your WhatsApp session has been unlinked.",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ─── 6. START DIRECT CHAT WITH ANY PHONE NUMBER ───
  const handleStartDirectChat = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!directForm.phone.trim()) {
      Swal.fire("Phone Number Required", "Please enter the recipient's phone number.", "warning");
      return;
    }

    setStartingChat(true);
    try {
      const res = await messagesService.startDirectChat({
        phone: directForm.phone.trim(),
        name: directForm.name.trim() || `+91 ${directForm.phone.trim()}`,
        role: directForm.role
      });

      if (res?.success && res.data) {
        await fetchThreads();
        setActiveThreadId(res.data.threadId);
        setIsMobileListOpen(false);
        setShowDirectModal(false);
        setDirectForm({ phone: '', name: '', role: 'Parent' });
      }
    } catch (err) {
      Swal.fire("Error", "Could not start chat with this number.", "error");
    } finally {
      setStartingChat(false);
    }
  };

  // ─── 6B. CLEAR THREAD HISTORY ───
  const handleClearHistory = async () => {
    if (!activeThread) return;
    const { isConfirmed } = await Swal.fire({
      title: "Clear Chat History?",
      text: `Are you sure you want to delete all messages with ${activeThread.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Clear Messages"
    });
    if (!isConfirmed) return;

    try {
      await messagesService.clearHistory(activeThread.threadId);
      setMessages([]);
      await fetchThreads();
      Swal.fire({
        icon: "success",
        title: "Cleared",
        text: "Chat messages have been deleted.",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not clear chat messages.", "error");
    }
  };

  // ─── 6C. DELETE CONVERSATION THREAD ───
  const handleDeleteThread = async (threadId, threadName, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const id = threadId || activeThread?.threadId;
    const name = threadName || activeThread?.name || 'this contact';
    if (!id) return;

    const { isConfirmed } = await Swal.fire({
      title: "Delete Conversation?",
      text: `Are you sure you want to permanently delete the conversation with ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete"
    });
    if (!isConfirmed) return;

    try {
      await messagesService.deleteThread(id);
      const updatedThreads = threads.filter(t => t.threadId !== id);
      setThreads(updatedThreads);
      if (activeThreadId === id) {
        setActiveThreadId(updatedThreads.length > 0 ? updatedThreads[0].threadId : null);
        setMessages([]);
      }
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Conversation deleted successfully.",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not delete conversation.", "error");
    }
  };

  // ─── 6D. DELETE SINGLE MESSAGE ───
  const handleDeleteMessage = async (messageId) => {
    if (!activeThread || !messageId) return;
    try {
      await messagesService.deleteMessage(activeThread.threadId, messageId);
      setMessages(prev => prev.filter(m => m._id !== messageId));
      await fetchThreads();
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // ─── 6E. CLEAR ALL CONVERSATIONS ───
  const handleClearAllConversations = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete All Conversations?",
      text: "This will permanently delete all messages and conversations from the database.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Everything"
    });
    if (!isConfirmed) return;

    try {
      await messagesService.clearAllChats();
      setThreads([]);
      setMessages([]);
      setActiveThreadId(null);
      Swal.fire({
        icon: "success",
        title: "All Chats Cleared",
        text: "All fake and old messages have been permanently removed.",
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to clear conversations.", "error");
    }
  };

  // ─── 7. SEND MESSAGE ───
  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const textToSend = inputText.trim();
    setInputText("");
    setShowEmojiPicker(false);
    setSending(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const tempMsg = {
      _id: `temp-${Date.now()}`,
      threadId: activeThread.threadId,
      sender: "You",
      senderRole: "Admin (WhatsApp)",
      content: textToSend,
      isSelf: true,
      time: timeStr,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      // 1. Post to MongoDB chat history
      const res = await messagesService.sendMessage(activeThread.threadId, {
        content: textToSend,
        sender: "You",
        senderRole: "Admin (WhatsApp)"
      });

      if (res?.data) {
        setMessages(prev => prev.map(m => m._id === tempMsg._id ? res.data : m));
        setThreads(prev => prev.map(t => 
          t.threadId === activeThread.threadId 
            ? { ...t, lastMsg: textToSend, lastMsgAt: new Date() }
            : t
        ));
      }

      // 2. Dispatch via WhatsApp Gateway / Cloud API if recipient phone is present
      const recipientPhone = activePhone || (activeThread.name.match(/[0-9]{10}/) ? activeThread.name : null);
      if (recipientPhone) {
        await messagesService.sendWhatsAppNotification({
          phone: recipientPhone,
          recipientName: activeThread.name,
          senderName: adminSession.isConnected ? `${adminSession.name} (+${adminSession.phone})` : "School Admin",
          content: textToSend,
          threadId: activeThread.threadId
        }).catch(() => {});
      }

    } catch (err) {
      console.error("Failed to send message:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Could not send message.",
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setSending(false);
    }
  };



  // Filtered threads by category
  const filteredThreads = threads.filter(t => {
    if (activeCategory === "all") return true;
    if (activeCategory === "students") return t.role?.toLowerCase().includes("student") || t.name?.toLowerCase().includes("student");
    if (activeCategory === "parents") return t.role?.toLowerCase().includes("parent") || t.name?.toLowerCase().includes("parent") || t.role?.toLowerCase().includes("guardian");
    if (activeCategory === "staff") return t.role?.toLowerCase().includes("faculty") || t.role?.toLowerCase().includes("staff") || t.role?.toLowerCase().includes("teacher");
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f0f2f5] font-sans text-slate-800 overflow-hidden">
      
      {/* ══════════════════════════════════════════════════════════════
          TOP WHATSAPP APP BAR (CLEAN & ELEGANT)
          ══════════════════════════════════════════════════════════════ */}
      <header className="bg-[#00a884] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-bold shadow-inner">
            <MessageCircle className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base leading-tight tracking-wide">WhatsApp Messenger</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-800/50 text-[10px] font-black uppercase tracking-wider border border-white/20">
                School ERP
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 font-medium">Official School WhatsApp Communications</p>
          </div>
        </div>

        {/* ADMIN SELF NUMBER STATUS & LOGIN BUTTON */}
        <div className="flex items-center gap-2">
          {adminSession.isConnected ? (
            <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-400/40 px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-200 uppercase font-black tracking-wider leading-none">Self WhatsApp Active</span>
                <span className="font-mono font-bold text-white text-xs">+{adminSession.phone}</span>
              </div>
              <button
                onClick={handleDisconnectWhatsApp}
                className="ml-2 p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/60 rounded-xl transition-colors cursor-pointer"
                title="Disconnect or Switch WhatsApp Number"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setPairingCode(`ERP-${Math.floor(1000 + Math.random() * 9000)}`);
                setShowLoginModal(true);
              }}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border-none"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Login With WhatsApp (Self Number)</span>
            </button>
          )}

          <button
            onClick={() => setShowDirectModal(true)}
            className="px-3.5 py-2 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            title="Start Chat with any Phone Number"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Direct Chat</span>
          </button>

          <button
            onClick={() => window.open('https://web.whatsapp.com', '_blank')}
            className="px-3.5 py-2 bg-emerald-950/70 hover:bg-emerald-950 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 border border-emerald-400/30 transition-all cursor-pointer shadow-xs"
            title="Open Official WhatsApp Web in New Window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
            <span>Open WhatsApp Web</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          MAIN WHATSAPP DUAL-PANE CONTAINER
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ─── LEFT SIDEBAR: CHATS LIST ─── */}
        <aside className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 transition-transform ${
          isMobileListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 absolute md:relative inset-0'
        }`}>
          
          {/* Search Box */}
          <div className="p-3 bg-[#f0f2f5] border-b border-slate-200/80 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new chat"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600 transition-all"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'parents', label: 'Parents' },
                { id: 'students', label: 'Students' },
                { id: 'staff', label: 'Staff' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border-none shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200/70 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                <span>Loading WhatsApp chats...</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs space-y-3">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">No conversations found</p>
                <button
                  onClick={() => setShowDirectModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  + Start Chat With Phone Number
                </button>
              </div>
            ) : (
              filteredThreads.map(t => {
                const isSelected = t.threadId === activeThread?.threadId;

                return (
                  <div
                    key={t.threadId}
                    onClick={() => {
                      setActiveThreadId(t.threadId);
                      setIsMobileListOpen(false);
                    }}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors relative group ${
                      isSelected ? 'bg-[#f0f2f5] border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      {t.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">
                          {t.name}
                        </h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            {t.lastMsgAt ? new Date(t.lastMsgAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                          <button
                            onClick={(e) => handleDeleteThread(t.threadId, t.name, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer border-none bg-transparent"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[9px] font-bold">
                          {t.role || 'Contact'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate font-normal">
                        {t.lastMsg || 'Tap to chat'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ─── RIGHT MAIN PANEL: ACTIVE WHATSAPP CHAT ─── */}
        <main className={`flex-1 flex flex-col bg-[#efeae2] overflow-hidden ${
          isMobileListOpen ? 'hidden md:flex' : 'flex'
        }`}>
          {activeThread ? (
            <>
              {/* Active Conversation Header */}
              <div className="px-4 py-2.5 bg-[#f0f2f5] border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setIsMobileListOpen(true)}
                    className="md:hidden p-1.5 text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={activeThread.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                    alt={activeThread.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  />

                  <div className="min-w-0">
                    <h2 className="font-extrabold text-sm text-slate-900 truncate">
                      {activeThread.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>{activeThread.role}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct External WhatsApp Link & Clear History */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenChatInWhatsApp()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer border-none"
                    title="Open chat directly in WhatsApp Web / App"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </button>

                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                    title="Clear Messages in Chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteThread(activeThread.threadId, activeThread.name, e)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Message Wallpaper & Bubbles */}
              <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3"
                style={{
                  backgroundImage: `radial-gradient(#d1d7db 0.8px, transparent 0.8px)`,
                  backgroundSize: "16px 16px"
                }}
              >
                {/* Date Divider */}
                <div className="flex justify-center my-2">
                  <span className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-600 shadow-2xs uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {messagesLoading ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-700">No messages yet</p>
                    <p>Send a message from your connected WhatsApp number.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isSelf = m.isSelf || m.sender === "You";

                    return (
                      <div
                        key={m._id || idx}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        {!isSelf && (
                          <span className="text-[10px] font-bold text-slate-500 px-1 mb-0.5">
                            {m.sender}
                          </span>
                        )}

                        <div
                          className={`max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-2xl shadow-2xs text-xs relative group ${
                            isSelf
                              ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                              : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/50'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap font-normal">{m.content}</p>

                          <div className="flex items-center justify-between gap-2 text-[10px] mt-1 text-slate-500 font-mono">
                            {m._id ? (
                              <button
                                onClick={() => handleDeleteMessage(m._id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500 rounded transition-opacity cursor-pointer border-none bg-transparent"
                                title="Delete this message"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            ) : <span />}
                            <div className="flex items-center gap-1 ml-auto">
                              <span>{m.time || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}</span>
                              {isSelf && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Message Input Bar */}
              <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 shrink-0 space-y-2">
                
                {/* Quick Templates Drawer */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Notice:</span>
                  {QUICK_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.label}
                      type="button"
                      onClick={() => setInputText(tmpl.text)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shrink-0 transition-colors cursor-pointer shadow-2xs"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>

                {/* Emoji Bar */}
                {showEmojiPicker && (
                  <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-200 flex items-center gap-2 overflow-x-auto">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText(prev => prev + " " + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg p-1 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                    title="Insert Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      adminSession.isConnected 
                        ? `Type message from +${adminSession.phone}...` 
                        : `Type message to ${activeThread.name}...`
                    }
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 transition-all shadow-inner"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-full shadow-md shadow-emerald-600/30 cursor-pointer border-none transition-all active:scale-95 flex items-center justify-center shrink-0"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (inputText.trim()) {
                        handleOpenChatInWhatsApp(inputText.trim());
                      } else {
                        handleOpenChatInWhatsApp();
                      }
                    }}
                    className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none shadow-xs transition-all shrink-0"
                    title="Open directly in WhatsApp Web with this message"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="hidden sm:inline">Open in WhatsApp</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-1">WhatsApp Web for School Admin</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Select a contact from the left or click "Direct Chat" to send WhatsApp messages from your registered phone number.
              </p>
              <button
                onClick={() => setShowDirectModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Start Direct WhatsApp Chat
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL 1: OFFICIAL META WHATSAPP CLOUD API STATUS
          ══════════════════════════════════════════════════════════════ */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#00a884] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Meta WhatsApp Cloud API</h3>
                  <p className="text-xs text-emerald-100">Official Business Communication</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {adminSession.isConnected ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">
                      {adminSession.name || 'Meta WhatsApp Verified'}
                    </h4>
                    <p className="font-mono text-sm font-bold text-emerald-800">
                      +{adminSession.phone}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Quality: {adminSession.qualityRating || 'GREEN'}
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                        Official Cloud API
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    Student notifications, homework alerts, and exam datesheets are dispatched automatically via Meta WhatsApp Cloud API.
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => window.open('https://web.whatsapp.com', '_blank')}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch WhatsApp Web (web.whatsapp.com)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDisconnectWhatsApp}
                      className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Disconnect WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <p className="font-bold">Meta WhatsApp Cloud API Configuration Required</p>
                      <p className="text-amber-700 mt-1">
                        Configure your Meta Phone Number ID and Permanent Access Token in <b>SuperAdmin Settings &gt; WhatsApp Gateway</b> to enable automated messaging.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-700">Supported Features:</p>
                    <p>• Official Meta WhatsApp Cloud API</p>
                    <p>• Approved Templates (Fee alerts, Homework, Notices)</p>
                    <p>• Real-time Webhook Delivery Tracking (Sent / Delivered / Read)</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => window.open('https://web.whatsapp.com', '_blank')}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open WhatsApp Web in Browser</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="w-full py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 2: DIRECT CHAT WITH ANY PHONE NUMBER
          ══════════════════════════════════════════════════════════════ */}
      {showDirectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#00a884] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <h3 className="font-extrabold text-base">Direct WhatsApp Chat</h3>
              </div>
              <button
                onClick={() => setShowDirectModal(false)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartDirectChat} className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Enter any mobile number to start a WhatsApp conversation directly from your connected line.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <div className="flex">
                  <span className="px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={directForm.phone}
                    onChange={(e) => setDirectForm({ ...directForm, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name (Optional)</label>
                <input
                  type="text"
                  value={directForm.name}
                  onChange={(e) => setDirectForm({ ...directForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar (Parent)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={directForm.role}
                  onChange={(e) => setDirectForm({ ...directForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="Parent">Parent</option>
                  <option value="Student">Student</option>
                  <option value="Staff">Faculty / Staff</option>
                  <option value="Other">Other Contact</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDirectModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={startingChat}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {startingChat ? "Opening..." : "Start Chat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
