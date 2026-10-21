import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle, Smartphone, RefreshCw, Send,
  CheckCircle2, AlertCircle, Copy, ExternalLink, Unlink, Save, Check,
  ShieldCheck, Eye, EyeOff, Key, Radio, Activity, HelpCircle
} from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import axiosInstance from '../../api/axios';

export default function WhatsAppGatewaySettings() {
  // Meta Cloud API Configuration State
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [apiVersion, setApiVersion] = useState('v20.0');
  const [webhookVerifyToken, setWebhookVerifyToken] = useState('school_erp_meta_webhook_secret');
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);

  // Live Meta Status & Verification State
  const [session, setSession] = useState({
    isConnected: false,
    phone: '',
    name: 'Meta WhatsApp Cloud API',
    qualityRating: 'UNKNOWN',
    codeVerificationStatus: 'UNKNOWN',
    accountMode: 'LIVE',
    maskedToken: '',
    apiVersion: 'v20.0',
    lastVerifiedAt: null,
    webhookUrl: '',
    webhookVerifyToken: ''
  });
  const [sessionLoading, setSessionLoading] = useState(true);

  // Test Messenger Mode ('template' | 'text')
  const [sendMode, setSendMode] = useState('template');
  const [testPhone, setTestPhone] = useState('');
  const [templateName, setTemplateName] = useState('hello_world');
  const [languageCode, setLanguageCode] = useState('en_US');
  const [testMessage, setTestMessage] = useState('Hello! This is an official message from Greenwood School ERP via Meta WhatsApp Cloud API.');
  const [sendingTest, setSendingTest] = useState(false);
  const [lastTestResult, setLastTestResult] = useState(null);

  // Delivery Tracking Logs
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // 1. Fetch Live Meta Cloud API Status
  const fetchSession = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/chats/whatsapp/session');
      if (res?.data?.success && res.data.data) {
        const d = res.data.data;
        setSession(d);
        if (d.phoneNumberId && !phoneNumberId) setPhoneNumberId(d.phoneNumberId);
        if (d.wabaId && !wabaId) setWabaId(d.wabaId);
        if (d.apiVersion) setApiVersion(d.apiVersion);
        if (d.webhookVerifyToken) setWebhookVerifyToken(d.webhookVerifyToken);
      }
    } catch (e) {
      console.warn('Meta session fetch note:', e.message);
    } finally {
      setSessionLoading(false);
    }
  }, [phoneNumberId, wabaId]);

  // 2. Fetch Recent Delivery Logs
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await axiosInstance.get('/chats/whatsapp/logs?limit=15');
      if (res?.data?.success && res.data.data?.logs) {
        setLogs(res.data.data.logs);
      }
    } catch (e) {
      console.warn('Delivery logs fetch note:', e.message);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
    fetchLogs();
  }, [fetchSession, fetchLogs]);

  // 3. Verify & Save Credentials with Meta Graph API
  const handleVerifyAndSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!phoneNumberId.trim()) {
      Swal.fire('Phone Number ID Required', 'Please enter your Meta WhatsApp Phone Number ID (from developers.facebook.com > WhatsApp > API Setup).', 'warning');
      return;
    }
    if (!accessToken.trim() && !session.maskedToken) {
      Swal.fire('Access Token Required', 'Please enter your Meta System User Permanent Access Token.', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await axiosInstance.post('/chats/whatsapp/connect', {
        phoneNumberId: phoneNumberId.trim(),
        wabaId: wabaId.trim(),
        accessToken: accessToken.trim(),
        apiVersion: apiVersion.trim() || 'v20.0',
        webhookVerifyToken: webhookVerifyToken.trim() || 'school_erp_meta_webhook_secret'
      });

      if (res?.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Meta API Verified Successfully!',
          html: `<div style="text-align:left;font-size:13px;line-height:1.7;">
            <p>✅ <b>Verified Name:</b> ${res.data.data?.verifiedName || 'Meta Business Account'}</p>
            <p>📱 <b>Display Phone:</b> ${res.data.data?.displayPhoneNumber || phoneNumberId}</p>
            <p>⭐ <b>Quality Rating:</b> <span style="color:#059669;font-weight:bold">${res.data.data?.qualityRating || 'GREEN'}</span></p>
            <p>🔒 <b>Status:</b> ${res.data.data?.codeVerificationStatus || 'VERIFIED'}</p>
          </div>`,
          confirmButtonColor: '#00a884'
        });
        setAccessToken(''); // Clear secret from form state for safety
        await fetchSession();
        await fetchLogs();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Meta verification failed.';
      const code = err.response?.data?.metaErrorCode ? ` (Error Code: ${err.response.data.metaErrorCode})` : '';
      const details = err.response?.data?.details ? `<p style="color:#b91c1c;margin-top:8px;">${err.response.data.details}</p>` : '';

      Swal.fire({
        icon: 'error',
        title: 'Meta API Verification Rejected' + code,
        html: `<div style="text-align:left;font-size:13px;line-height:1.6;">
          <p>${msg}</p>
          ${details}
          <hr style="margin:10px 0;border:0;border-top:1px solid #e2e8f0;"/>
          <p style="font-size:11px;color:#64748b;">Check your Phone Number ID and ensure your Meta System User has the <code>whatsapp_business_messaging</code> permission.</p>
        </div>`,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  // 4. Disconnect / Clear Meta Credentials
  const handleDisconnect = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'Remove Meta Cloud API?',
      text: 'This will remove the active Meta Phone Number ID and Access Token from the ERP database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Remove'
    });

    if (!isConfirmed) return;

    try {
      await axiosInstance.post('/chats/whatsapp/disconnect');
      setPhoneNumberId('');
      setWabaId('');
      setAccessToken('');
      setSession({
        isConnected: false,
        phone: '',
        name: 'Meta WhatsApp Cloud API',
        qualityRating: 'UNKNOWN',
        codeVerificationStatus: 'UNKNOWN',
        accountMode: 'LIVE',
        maskedToken: '',
        apiVersion: 'v20.0',
        lastVerifiedAt: null,
        webhookUrl: '',
        webhookVerifyToken: ''
      });
      Swal.fire('Removed', 'Meta WhatsApp Cloud API configuration has been cleared.', 'success');
      setTimeout(fetchSession, 500);
    } catch (e) {
      Swal.fire('Error', 'Failed to remove credentials.', 'error');
    }
  };

  // 5. Send Real Meta WhatsApp Test Message
  const handleSendTestMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!testPhone.trim()) {
      Swal.fire('Recipient Number Required', 'Please enter a recipient mobile number (e.g. +91 98765 43210).', 'warning');
      return;
    }

    setSendingTest(true);
    setLastTestResult(null);

    const payload = {
      phone: testPhone.trim(),
      recipientName: 'Test Recipient',
      senderName: 'SuperAdmin',
      messageType: sendMode,
      ...(sendMode === 'template'
        ? { templateName: templateName.trim(), languageCode: languageCode.trim() }
        : { content: testMessage.trim() })
    };

    try {
      const res = await axiosInstance.post('/chats/whatsapp/send', payload);
      if (res?.data?.success) {
        setLastTestResult({
          success: true,
          messageId: res.data.data?.messageId,
          recipient: res.data.data?.recipient,
          status: res.data.data?.status || 'accepted'
        });

        Swal.fire({
          icon: 'success',
          title: 'Meta Accepted Message!',
          html: `<div style="text-align:left;font-size:13px;line-height:1.7;">
            <p>✅ <b>Meta Message ID (wamid):</b><br/><code style="font-size:11px;background:#f1f5f9;padding:2px 6px;border-radius:4px;">${res.data.data?.messageId}</code></p>
            <p>📱 <b>Recipient:</b> +${res.data.data?.recipient}</p>
            <p>🕒 <b>Initial Status:</b> <span style="color:#059669;font-weight:bold">Accepted by Meta Cloud API</span></p>
            <p style="font-size:11px;color:#64748b;margin-top:6px;">Final delivery status (sent/delivered/read) will update automatically via Meta Webhooks.</p>
          </div>`,
          confirmButtonColor: '#00a884'
        });
        fetchLogs();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Meta Cloud API rejected the message.';
      const code = err.response?.data?.metaErrorCode ? ` (Code ${err.response.data.metaErrorCode})` : '';
      const details = err.response?.data?.details || '';

      setLastTestResult({
        success: false,
        error: errorMsg,
        code: err.response?.data?.metaErrorCode,
        details
      });

      Swal.fire({
        icon: 'error',
        title: 'Meta API Dispatch Rejected' + code,
        html: `<div style="text-align:left;font-size:13px;line-height:1.6;">
          <p>${errorMsg}</p>
          ${details ? `<p style="color:#b91c1c;margin-top:6px;font-size:12px;">${details}</p>` : ''}
          <hr style="margin:10px 0;border:0;border-top:1px solid #e2e8f0;"/>
          <p style="font-size:11px;color:#64748b;">
            <b>Common Meta Cloud API Causes:</b><br/>
            • <b>Test Number:</b> If using a Meta test number, add recipient to "To" list in Meta App Dashboard.<br/>
            • <b>Out-of-Session:</b> Direct text messages require a 24-hour customer window. Use the approved <code>hello_world</code> template for out-of-session tests.
          </p>
        </div>`,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Helper: Copy to clipboard with toast
  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${label} copied!`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const currentWebhookUrl = session.webhookUrl || `${window.location.protocol}//${window.location.host.split(':')[0]}:5050/api/chats/whatsapp/webhook`;

  return (
    <SettingsLayout activeTab="whatsapp">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5 mb-1">
              <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
                <MessageCircle className="w-6 h-6 fill-emerald-600 text-white" />
              </span>
              Official Meta WhatsApp Cloud API Gateway
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enterprise Meta WhatsApp Business Cloud API integration for automated student notifications, fee reminders, homework alerts, and two-way parent communication.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 1: LIVE META CLOUD API CONNECTION STATUS
              ══════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-emerald-500/10 via-emerald-50/50 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00a884] text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    Meta WhatsApp Business Platform
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-md">Official Cloud API</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Direct integration via Meta Graph API • Multi-Tenant Enterprise Tier
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {session.isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified: {session.phone || 'Active'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Meta Credentials Required
                </span>
              )}
            </div>

            <div className="p-6">
              {session.isConnected ? (
                /* Verified State Banner */
                <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        {session.name || 'Meta WhatsApp Business Verified'}
                        <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md">Graph API {session.apiVersion || 'v20.0'}</span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Verified Display Phone: <strong className="text-emerald-950 font-mono">{session.phone || 'Configured'}</strong>
                        {session.phoneNumberId && <span> • Phone ID: <code className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">{session.phoneNumberId}</code></span>}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-bold text-emerald-700">
                          Quality: {session.qualityRating || 'GREEN'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-bold text-slate-700">
                          Status: {session.codeVerificationStatus || 'VERIFIED'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-bold text-blue-700">
                          Account: {session.accountMode || 'LIVE'}
                        </span>
                        {session.maskedToken && (
                          <span className="font-mono text-slate-500">
                            Token: {session.maskedToken}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => fetchSession()}
                      className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Unconfigured Notice */
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold">Official Meta WhatsApp Cloud API credentials required.</p>
                    <p className="text-amber-700 mt-0.5">
                      Enter your Meta Phone Number ID and System User Permanent Access Token below. The backend will verify your credentials live with Meta Graph API servers.
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  FORM: META CLOUD API CREDENTIALS
                  ══════════════════════════════════════════════════════════════ */}
              <form onSubmit={handleVerifyAndSave} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Number ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meta Phone Number ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      placeholder="e.g. 109823471928374"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">From: Meta Developer App &gt; WhatsApp &gt; API Setup &gt; Phone Number ID</p>
                  </div>

                  {/* WABA ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Business Account ID (WABA ID)
                    </label>
                    <input
                      type="text"
                      value={wabaId}
                      onChange={(e) => setWabaId(e.target.value)}
                      placeholder="e.g. 101928374650192"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">From: WhatsApp &gt; API Setup &gt; WhatsApp Business Account ID</p>
                  </div>

                  {/* System User Access Token */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meta Permanent Access Token (System User) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showToken ? 'text' : 'password'}
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder={session.maskedToken ? `Active Token: ${session.maskedToken} (Enter new token to update)` : 'EAAB... (Paste permanent access token)'}
                        className="w-full border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showToken ? 'Hide token' : 'Show token'}
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Use a Permanent System User Token with <code>whatsapp_business_messaging</code> and <code>whatsapp_business_management</code> permissions. Stored securely on backend.
                    </p>
                  </div>

                  {/* Graph API Version */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Graph API Version</label>
                    <input
                      type="text"
                      value={apiVersion}
                      onChange={(e) => setApiVersion(e.target.value)}
                      placeholder="v20.0"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Webhook Verify Token */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Webhook Verify Token</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={webhookVerifyToken}
                        onChange={(e) => setWebhookVerifyToken(e.target.value)}
                        placeholder="school_erp_meta_webhook_secret"
                        className="flex-1 border border-r-0 border-slate-200 rounded-l-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(webhookVerifyToken, 'Webhook Verify Token')}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-r-xl text-slate-700 cursor-pointer text-xs"
                        title="Copy Verify Token"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    WEBHOOK CONFIGURATION CARD FOR META DASHBOARD
                    ══════════════════════════════════════════════════════════════ */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      Meta Webhook Callback URL (For Real Delivery Tracking)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentWebhookUrl, 'Webhook Callback URL')}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy URL
                    </button>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                    {currentWebhookUrl}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    In your Meta Developer App &gt; <b>WhatsApp &gt; Configuration &gt; Webhook</b>, click <b>Edit</b>, paste this Callback URL, enter your Verify Token, and subscribe to the <code>messages</code> field to receive delivery status (sent, delivered, read, failed).
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#00a884] hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all border-none"
                  >
                    {saving ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying with Meta Graph API...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Verify &amp; Save with Meta API</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2: OFFICIAL META TEST MESSENGER (LIVE SEND)
              ══════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" /> Official Meta Cloud API Test Messenger
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Cloud API Dispatch
              </span>
            </div>

            <form onSubmit={handleSendTestMessage} className="p-6 space-y-4">
              {/* Mode Selector */}
              <div className="flex max-w-md bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSendMode('template')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${sendMode === 'template' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 bg-transparent'}`}
                >
                  📄 Approved Template (hello_world)
                </button>
                <button
                  type="button"
                  onClick={() => setSendMode('text')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${sendMode === 'text' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 bg-transparent'}`}
                >
                  💬 Custom Text Message
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Recipient Mobile Number *</label>
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="e.g. 919876543210 (with country code)"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">E.164 format with country code (e.g. 91XXXXXXXXXX for India)</p>
                </div>

                {sendMode === 'template' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Approved Template Name *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="hello_world"
                        className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                      />
                      <input
                        type="text"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        placeholder="en_US"
                        className="w-20 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-mono text-center text-slate-800 focus:outline-none focus:border-emerald-600"
                        title="Language Code"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Meta default template: <code>hello_world</code> (language: <code>en_US</code>) works out-of-the-box.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Text Message Content *</label>
                    <input
                      type="text"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Enter test message..."
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Note: Regular text messages require an active 24h conversation window opened by the recipient.
                    </p>
                  </div>
                )}
              </div>

              {/* Real Provider Result Display */}
              {lastTestResult && (
                <div className={`p-4 rounded-2xl border text-xs ${lastTestResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                  {lastTestResult.success ? (
                    <div>
                      <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Message Accepted by Meta WhatsApp Cloud API!
                      </p>
                      <p className="font-mono text-[11px] mt-1">
                        Meta Message ID (wamid): <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300">{lastTestResult.messageId}</code>
                      </p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Recipient: +{lastTestResult.recipient} • Status: {lastTestResult.status}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold flex items-center gap-1.5 text-red-800">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Meta Provider Rejected Request {lastTestResult.code ? `(Code ${lastTestResult.code})` : ''}
                      </p>
                      <p className="text-[11px] text-red-700 mt-1">{lastTestResult.error}</p>
                      {lastTestResult.details && <p className="text-[10px] text-red-600 mt-0.5">{lastTestResult.details}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sendingTest || !session.isConnected}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all border-none"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingTest ? 'Dispatching to Meta...' : 'Send Live Meta WhatsApp Message'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3: META DELIVERY & STATUS LOGS
              ══════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Recent Meta Delivery &amp; Webhook Logs
              </h3>
              <button
                type="button"
                onClick={fetchLogs}
                disabled={logsLoading}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="p-6">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <MessageCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  No Meta WhatsApp messages dispatched yet. Send a test message above to view delivery logs.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                        <th className="py-2.5 px-3">Recipient Phone</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Content / Template</th>
                        <th className="py-2.5 px-3">Meta Message ID (wamid)</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.map((log) => {
                        const statusColors = {
                          accepted: 'bg-blue-50 text-blue-700 border-blue-200',
                          sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                          read: 'bg-purple-50 text-purple-700 border-purple-200',
                          failed: 'bg-red-50 text-red-700 border-red-200',
                          pending: 'bg-slate-100 text-slate-600 border-slate-200'
                        };
                        const badgeClass = statusColors[log.status] || 'bg-slate-100 text-slate-600 border-slate-200';

                        return (
                          <tr key={log._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-800 font-mono">
                              +{log.phone}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-600 uppercase text-[10px]">
                              {log.messageType}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={log.content || log.templateName}>
                              {log.content || log.templateName}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 max-w-xs truncate" title={log.wamid || 'Pending'}>
                              {log.wamid || '—'}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${badgeClass}`}>
                                {log.status}
                              </span>
                              {log.errorMessage && (
                                <p className="text-[10px] text-red-600 mt-0.5 truncate max-w-xs" title={log.errorMessage}>
                                  {log.errorMessage}
                                </p>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </SettingsLayout>
  );
}
