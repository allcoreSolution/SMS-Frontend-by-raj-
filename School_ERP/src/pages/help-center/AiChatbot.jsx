import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  BookOpen,
  DollarSign,
  Calendar,
  Layers,
  Building,
  RefreshCw
} from "lucide-react";
import { helpCenterService } from "../../api/helpCenterService";
import HelpCenterNav from "./HelpCenterNav";

const SUGGESTED_QUERIES = [
  { text: "How to collect student fees & print receipts?", icon: DollarSign },
  { text: "How to record daily attendance & send SMS?", icon: Calendar },
  { text: "How to allocate hostel rooms & beds?", icon: Building },
  { text: "How to enter exam marks & print marksheets?", icon: BookOpen },
  { text: "Troubleshoot biometric machine sync issue", icon: Layers }
];

export default function AiChatbot() {
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [messages, setMessages] = useState([
    { 
      id: "initial", 
      sender: "bot", 
      text: "Hello! I am your **School ERP AI Assistant**. I can guide you through every institutional workflow — including fees collection, student admissions, exam marksheets, hostel allocations, biometric attendance, and system settings.\n\nWhat can I assist you with today?", 
      time: "Just now" 
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const res = await helpCenterService.chatWithAi(text, conversationId);
      if (res?.data) {
        const botMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: res.data.reply,
          actionLink: res.data.actionLink,
          actionLabel: res.data.actionLabel,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      const fallbackMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "I experienced a temporary network issue. Please check your internet connection or browse our Knowledge Base articles directly.",
        actionLink: "/help-center/articles",
        actionLabel: "Browse Knowledge Base",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setConversationId(`conv-${Date.now()}`);
    setMessages([
      { 
        id: `initial-${Date.now()}`, 
        sender: "bot", 
        text: "Chat cleared! What school operation can I help you with now?", 
        time: "Just now" 
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 animate-fadeIn flex flex-col">
      {/* Top Navigation */}
      <HelpCenterNav />

      {/* Main Chat Container */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">ACS AI School Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Institutional guidance, workflows & knowledge retrieval
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            title="Reset Conversation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? "bg-slate-800 text-white"
                      : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] space-y-1.5 ${isUser ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/15"
                        : "bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {msg.text}

                    {/* Action Deep Link button if provided */}
                    {msg.actionLink && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-start">
                        <button
                          onClick={() => navigate(msg.actionLink)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
                        >
                          <span>{msg.actionLabel || "Open Module"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 block px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-100 text-slate-500 flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium">Assistant is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
          </span>
          {SUGGESTED_QUERIES.map((sq, idx) => {
            const Icon = sq.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(sq.text)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors shrink-0 cursor-pointer"
              >
                <Icon className="w-3 h-3 text-blue-600" />
                <span>{sq.text}</span>
              </button>
            );
          })}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about school operations, fees, attendance, marksheets, hostels..."
              disabled={isTyping}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
