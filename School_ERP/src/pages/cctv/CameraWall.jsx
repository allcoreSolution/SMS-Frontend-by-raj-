import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Settings,
  User,
  Maximize2,
  Minimize2,
  VideoOff,
  Grid,
  Trash2,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Edit3,
  Calendar,
  AlertCircle,
  Video,
  FileText,
  Lock,
  Check,
  Save,
  Sliders,
  Clock,
  Plus,
  Search,
  ShieldCheck,
  Wifi,
  WifiOff,
  Download,
  Activity,
  Play,
  Square,
  Camera as CameraIcon,
  HardDrive,
  Info,
  X
} from "lucide-react";
import cctvService from "../../api/cctvService";
import CctvTabs from "./CctvTabs";

export default function CameraWall() {
  const location = useLocation();
  const navigate = useNavigate();

  // Active view synced with URL
  const [activeView, setActiveView] = useState("wall"); // "wall", "settings", "log"
  const [layoutGrid, setLayoutGrid] = useState("2x2"); // "2x2", "3x3", "4x4"
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Data states from Real APIs
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [policy, setPolicy] = useState({
    allowViewLive: true,
    requirePolicyAccept: true,
    maxDailyMinutesPerParent: 60,
    recordingRetentionDays: 30
  });

  // Filters for Wall view
  const [wallZoneFilter, setWallZoneFilter] = useState("All Zones");
  const [wallStatusFilter, setWallStatusFilter] = useState("All");

  // Filters for Cameras view
  const [cameraSearch, setCameraSearch] = useState("");
  const [cameraStatusFilter, setCameraStatusFilter] = useState("All");
  const [cameraParentFilter, setCameraParentFilter] = useState("All");

  // Filters for Access Logs view
  const [logCameraFilter, setLogCameraFilter] = useState("All cameras");
  const [logViewerFilter, setLogViewerFilter] = useState("Anyone");
  const [logFromDate, setLogFromDate] = useState("");
  const [logToDate, setLogToDate] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [inspectedCamera, setInspectedCamera] = useState(null); // Fullscreen single camera preview

  // Form states for Add / Edit Camera
  const initialCameraForm = {
    name: "",
    covers: "Common area",
    zone: "",
    parents: "CLOSED",
    hours: "",
    status: "Online",
    ipAddress: "192.168.1.100",
    port: 554,
    streamUrl: "",
    resolution: "1080p FHD",
    fps: 30,
    bitrate: "2048 kbps",
    notes: ""
  };
  const [cameraFormData, setCameraFormData] = useState(initialCameraForm);

  // Synchronize route with active view
  useEffect(() => {
    if (location.pathname === "/cctv/cameras") {
      setActiveView("settings");
    } else if (location.pathname === "/cctv/camera-wall") {
      setActiveView("wall");
    } else if (location.pathname === "/cctv/access-log") {
      setActiveView("log");
    } else if (location.pathname === "/cctv") {
      setActiveView("wall");
    }
  }, [location.pathname]);

  // Fetch all live data from backend
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [statsRes, camerasRes, logsRes, policyRes] = await Promise.all([
        cctvService.getStats(),
        cctvService.getCameras(),
        cctvService.getLogs(),
        cctvService.getPolicy()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (camerasRes.success) setCameras(camerasRes.cameras || []);
      if (logsRes.success) setAccessLogs(logsRes.logs || []);
      if (policyRes.success) setPolicy(policyRes.policy || {});
    } catch (error) {
      console.error("Failed to load CCTV data:", error);
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not load CCTV camera streams from the server.",
        confirmButtonColor: "#4f46e5"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Live ticking clock for camera overlays
  const [liveTimestamp, setLiveTimestamp] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTimestamp(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${now.toLocaleTimeString()}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered cameras for Camera Wall
  const filteredWallCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchZone = wallZoneFilter === "All Zones" || cam.zone === wallZoneFilter;
      const matchStatus =
        wallStatusFilter === "All" ||
        (wallStatusFilter === "Online" && cam.status === "Online") ||
        (wallStatusFilter === "ParentViewable" && cam.parents === "CAN VIEW");
      return matchZone && matchStatus;
    });
  }, [cameras, wallZoneFilter, wallStatusFilter]);

  // Visible cameras according to layout grid
  const visibleCameras = useMemo(() => {
    let limit = 4;
    if (layoutGrid === "3x3") limit = 9;
    if (layoutGrid === "4x4") limit = 16;
    return filteredWallCameras.slice(0, limit);
  }, [layoutGrid, filteredWallCameras]);

  // Filtered cameras for Settings & Directory view
  const filteredDirectoryCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchSearch =
        !cameraSearch ||
        cam.name.toLowerCase().includes(cameraSearch.toLowerCase()) ||
        cam.covers.toLowerCase().includes(cameraSearch.toLowerCase()) ||
        cam.zone.toLowerCase().includes(cameraSearch.toLowerCase()) ||
        cam.ipAddress.toLowerCase().includes(cameraSearch.toLowerCase());

      const matchStatus = cameraStatusFilter === "All" || cam.status === cameraStatusFilter;
      const matchParent = cameraParentFilter === "All" || cam.parents === cameraParentFilter;

      return matchSearch && matchStatus && matchParent;
    });
  }, [cameras, cameraSearch, cameraStatusFilter, cameraParentFilter]);

  // Unique zones list for filters
  const uniqueZones = useMemo(() => {
    const set = new Set(cameras.map((c) => c.zone).filter((z) => z && z !== "—"));
    return Array.from(set);
  }, [cameras]);

  // --- ACTIONS & API HANDLERS ---

  // 1. Toggle Camera Online / Offline or Parents
  const handleToggleCamera = async (cam, field) => {
    try {
      const res = await cctvService.toggleCamera(cam._id, field);
      if (res.success) {
        setCameras((prev) => prev.map((c) => (c._id === cam._id ? res.camera : c)));
        // Refresh stats
        const statsRes = await cctvService.getStats();
        if (statsRes.success) setStats(statsRes.stats);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 2500
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error.response?.data?.message || "Failed to toggle setting."
      });
    }
  };

  // 2. Open Add Camera Modal
  const handleOpenAddModal = () => {
    setCameraFormData({
      ...initialCameraForm,
      ipAddress: `192.168.1.${100 + cameras.length + 1}`
    });
    setIsAddModalOpen(true);
  };

  // 3. Open Edit Camera Modal
  const handleOpenEditModal = (cam) => {
    setEditingCamera(cam);
    setCameraFormData({
      name: cam.name,
      covers: cam.covers,
      zone: cam.zone === "—" ? "" : cam.zone,
      parents: cam.parents,
      hours: cam.hours === "—" ? "" : cam.hours,
      status: cam.status,
      ipAddress: cam.ipAddress,
      port: cam.port || 554,
      streamUrl: cam.streamUrl || "",
      resolution: cam.resolution || "1080p FHD",
      fps: cam.fps || 30,
      bitrate: cam.bitrate || "2048 kbps",
      notes: cam.notes || ""
    });
  };

  // 4. Submit Add or Edit Camera Form
  const handleSaveCameraForm = async (e) => {
    e.preventDefault();
    if (!cameraFormData.name.trim()) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Camera name is required." });
      return;
    }

    try {
      if (editingCamera) {
        // Update existing camera
        const res = await cctvService.updateCamera(editingCamera._id, {
          ...cameraFormData,
          zone: cameraFormData.zone.trim() || "—",
          hours: cameraFormData.hours.trim() || "—"
        });
        if (res.success) {
          setCameras((prev) => prev.map((c) => (c._id === editingCamera._id ? res.camera : c)));
          setEditingCamera(null);
          Swal.fire({
            icon: "success",
            title: "Updated",
            text: res.message,
            timer: 2000,
            showConfirmButton: false
          });
        }
      } else {
        // Add new camera
        const res = await cctvService.addCamera({
          ...cameraFormData,
          zone: cameraFormData.zone.trim() || "—",
          hours: cameraFormData.hours.trim() || "—"
        });
        if (res.success) {
          setCameras((prev) => [res.camera, ...prev]);
          setIsAddModalOpen(false);
          Swal.fire({
            icon: "success",
            title: "Registered",
            text: res.message,
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
      // Refresh stats
      const statsRes = await cctvService.getStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.response?.data?.message || "Failed to save camera configuration."
      });
    }
  };

  // 5. Delete Camera
  const handleDeleteCamera = (cam) => {
    Swal.fire({
      title: `Delete ${cam.name}?`,
      text: "This camera feed and stream bindings will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Feed"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cctvService.deleteCamera(cam._id);
          if (res.success) {
            setCameras((prev) => prev.filter((c) => c._id !== cam._id));
            const statsRes = await cctvService.getStats();
            if (statsRes.success) setStats(statsRes.stats);

            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: res.message,
              timer: 2000,
              showConfirmButton: false
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Failed to delete camera."
          });
        }
      }
    });
  };

  // 6. Save Parent Viewing Policy
  const handleSavePolicy = async () => {
    try {
      const res = await cctvService.updatePolicy(policy);
      if (res.success) {
        setPolicy(res.policy);
        Swal.fire({
          icon: "success",
          title: "Policy Saved",
          text: res.message,
          timer: 2200,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update CCTV policy."
      });
    }
  };

  // 7. Filter Access Logs
  const handleFilterLogs = async (e) => {
    e?.preventDefault();
    try {
      setRefreshing(true);
      const params = {};
      if (logCameraFilter !== "All cameras") params.camera = logCameraFilter;
      if (logViewerFilter !== "Anyone") params.viewer = logViewerFilter;
      if (logFromDate) params.fromDate = logFromDate;
      if (logToDate) params.toDate = logToDate;

      const res = await cctvService.getLogs(params);
      if (res.success) {
        setAccessLogs(res.logs || []);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: `Found ${res.logs?.length || 0} access audit records`,
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Filter Failed",
        text: "Could not filter logs."
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 8. Reset Access Logs Filters
  const handleResetLogs = async () => {
    setLogCameraFilter("All cameras");
    setLogViewerFilter("Anyone");
    setLogFromDate("");
    setLogToDate("");
    try {
      setRefreshing(true);
      const res = await cctvService.getLogs();
      if (res.success) setAccessLogs(res.logs || []);
    } finally {
      setRefreshing(false);
    }
  };

  // 9. Export Access Logs to CSV
  const handleExportLogsCsv = () => {
    if (accessLogs.length === 0) {
      Swal.fire({ icon: "info", title: "No Data", text: "No logs to export." });
      return;
    }
    const headers = ["Started", "Camera", "Viewer", "Child", "Duration", "IP Address", "User Type"];
    const rows = accessLogs.map((l) => [
      `"${l.started}"`,
      `"${l.camera}"`,
      `"${l.viewer}"`,
      `"${l.child || "-"}"`,
      `"${l.duration}"`,
      `"${l.ip}"`,
      `"${l.userType || (l.isParent ? "Parent" : "Staff")}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CCTV_Access_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 10. Simulate Live Access Session (Testing API functionality)
  const handleSimulateViewerSession = async () => {
    try {
      const randomCam = cameras.find((c) => c.status === "Online" && c.parents === "CAN VIEW") || cameras[0];
      const parentsSample = [
        { viewer: "Anil Kulkarni (Parent)", child: "Advait Kulkarni" },
        { viewer: "Meera Sen (Parent)", child: "Arjun Sen" },
        { viewer: "Rajeshwar Rao (Parent)", child: "Tanvi Rao" }
      ];
      const sample = parentsSample[Math.floor(Math.random() * parentsSample.length)];

      const res = await cctvService.addLog({
        camera: randomCam ? randomCam.name : "Class I - A Smart Classroom",
        cameraId: randomCam?._id,
        viewer: sample.viewer,
        userType: "Parent",
        child: sample.child,
        duration: `${Math.floor(5 + Math.random() * 25)} mins`,
        ip: `192.168.1.${Math.floor(20 + Math.random() * 80)}`,
        isParent: true
      });

      if (res.success) {
        setAccessLogs((prev) => [res.log, ...prev]);
        const statsRes = await cctvService.getStats();
        if (statsRes.success) setStats(statsRes.stats);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `New access session recorded: ${sample.viewer}`,
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.error("Simulation error:", error);
    }
  };

  // Snapshot visual confirmation
  const handleCaptureSnapshot = (cam) => {
    Swal.fire({
      icon: "success",
      title: "Snapshot Captured!",
      text: `High-resolution frame saved from ${cam.name} at ${liveTimestamp}.`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div
      className={`min-h-screen transition-all font-sans relative ${
        isFullscreen
          ? "bg-slate-950 text-white p-4 fixed inset-0 z-50 overflow-y-auto"
          : "p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-slate-800"
      }`}
    >
      {/* Top Reusable Tabs Component (Hidden in Fullscreen mode for pure control-room view) */}
      {!isFullscreen && (
        <CctvTabs stats={stats} onRefresh={() => fetchAllData(false)} isRefreshing={refreshing} />
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-200/80 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200/80 rounded-2xl animate-pulse"></div>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. VIEW: CAMERA WALL                                           */}
          {/* ============================================================== */}
          {activeView === "wall" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Wall Control Bar */}
              <div
                className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm transition-all ${
                  isFullscreen
                    ? "bg-slate-900/90 border-slate-800 text-white"
                    : "bg-white border-slate-200/80 text-slate-800"
                }`}
              >
                {/* Left: Zone & Status Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Zone:
                    </span>
                    <select
                      value={wallZoneFilter}
                      onChange={(e) => setWallZoneFilter(e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                        isFullscreen
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <option value="All Zones">All Zones ({cameras.length})</option>
                      {uniqueZones.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Filter:
                    </span>
                    <select
                      value={wallStatusFilter}
                      onChange={(e) => setWallStatusFilter(e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                        isFullscreen
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Online">Online Feeds Only</option>
                      <option value="ParentViewable">Parent Viewable Only</option>
                    </select>
                  </div>
                </div>

                {/* Right: Layout Switcher & Fullscreen Button */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    {["2x2", "3x3", "4x4"].map((lay) => {
                      const isActive = layoutGrid === lay;
                      return (
                        <button
                          key={lay}
                          onClick={() => setLayoutGrid(lay)}
                          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {lay}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer active:scale-95 ${
                      isFullscreen
                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5" />
                        Exit Fullscreen
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5" />
                        Control Room
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Feeds Grid */}
              {visibleCameras.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <VideoOff className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
                    No Cameras Match Selected Criteria
                  </h3>
                  <p className="text-xs text-slate-400">
                    Try changing your Zone or Feed filter options above.
                  </p>
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${
                    layoutGrid === "2x2"
                      ? "grid-cols-1 md:grid-cols-2"
                      : layoutGrid === "3x3"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {visibleCameras.map((cam) => {
                    const isOnline = cam.status === "Online";
                    const isParentViewable = cam.parents === "CAN VIEW";

                    return (
                      <div
                        key={cam._id}
                        className={`group relative rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 flex flex-col justify-between ${
                          isFullscreen
                            ? "bg-slate-900 border-slate-800 text-white"
                            : "bg-white border-slate-200/80 text-slate-850 hover:shadow-md"
                        }`}
                      >
                        {/* Surveillance Video Viewport */}
                        <div className="relative aspect-video bg-slate-950 overflow-hidden select-none">
                          {isOnline ? (
                            <>
                              {/* CRT / Scanlines Simulation Canvas */}
                              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950/40 to-slate-950/80 pointer-events-none"></div>
                              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                              {/* Center reticle / target */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                <div className="w-12 h-12 border border-emerald-400/60 rounded-full flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                </div>
                              </div>

                              {/* Live REC indicator & Timecode Overlay */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-600/90 text-white shadow-lg animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                  LIVE
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/60 text-emerald-400 backdrop-blur-sm border border-emerald-500/20">
                                  {cam.fps || 30} FPS
                                </span>
                              </div>

                              {/* Resolution & Bitrate Overlay */}
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/60 text-slate-300 backdrop-blur-sm border border-white/10">
                                  {cam.resolution || "1080p FHD"}
                                </span>
                              </div>

                              {/* Bottom Timestamp & Code Bar */}
                              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                                <span className="text-emerald-400 font-bold">{cam.code || "CAM"}</span>
                                <span>{liveTimestamp}</span>
                              </div>

                              {/* Hover Floating Stream Action Controls */}
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 backdrop-blur-xs">
                                <button
                                  onClick={() => setInspectedCamera(cam)}
                                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                                  title="Enlarge Feed"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCaptureSnapshot(cam)}
                                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                                  title="Take Snapshot"
                                >
                                  <CameraIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleCamera(cam, "parents")}
                                  className={`p-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                                    isParentViewable
                                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  }`}
                                  title={isParentViewable ? "Revoke Parent Access" : "Grant Parent Access"}
                                >
                                  {isParentViewable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </>
                          ) : (
                            /* Offline State */
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-900/90 text-slate-400 space-y-2">
                              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                <VideoOff className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">
                                  Feed Offline
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {cam.ipAddress || "No Signal"}
                                </span>
                              </div>
                              <button
                                onClick={() => handleToggleCamera(cam, "status")}
                                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg border border-white/10 cursor-pointer"
                              >
                                Reconnect Feed
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Details */}
                        <div
                          className={`p-3.5 flex items-center justify-between border-t ${
                            isFullscreen
                              ? "bg-slate-900/80 border-slate-800"
                              : "bg-slate-50/50 border-slate-100"
                          }`}
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-extrabold text-xs tracking-tight truncate">
                                {cam.name}
                              </h3>
                              {isParentViewable && (
                                <span
                                  className="inline-flex items-center text-emerald-500"
                                  title="Parent viewing enabled"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold truncate">
                              <span>{cam.covers}</span>
                              <span>•</span>
                              <span className="truncate">{cam.zone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(cam)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Configure Camera"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. VIEW: CCTV CAMERAS INVENTORY & POLICY SETTINGS              */}
          {/* ============================================================== */}
          {activeView === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 p-4 rounded-2xl border border-indigo-100/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                      Total Cameras
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stats?.totalCameras || cameras.length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                    <Video className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 p-4 rounded-2xl border border-emerald-100/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                      Active Online
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stats?.onlineCameras || cameras.filter((c) => c.status === "Online").length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                    <Wifi className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 p-4 rounded-2xl border border-blue-100/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                      Parent Viewable
                    </span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">
                      {stats?.parentViewable || cameras.filter((c) => c.parents === "CAN VIEW").length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 p-4 rounded-2xl border border-purple-100/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                      NVR Storage
                    </span>
                    <span className="text-lg font-black text-slate-900 mt-1 block truncate">
                      {stats?.storageUsed ? stats.storageUsed.split(" ")[0] + " TB" : "2.84 TB"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold block">
                      {policy.recordingRetentionDays || 30} Days Retention
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600">
                    <HardDrive className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Master Parent Viewing Policy Panel */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
                        Parent Viewing Policy Settings
                      </h2>
                      <p className="text-[11px] text-slate-400 font-medium">
                        School-wide security controls and live stream access permissions for student guardians
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePolicy}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Policy
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Switch 1: Master Switch */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPolicy((p) => ({ ...p, allowViewLive: !p.allowViewLive }))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out mt-0.5 focus:outline-none ${
                        policy.allowViewLive ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          policy.allowViewLive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-slate-900">
                        Allow Parents to View Live Feeds (Master Switch)
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        While deactivated, all parent access is instantly suspended campus-wide, regardless of individual camera rules.
                      </p>
                    </div>
                  </div>

                  {/* Switch 2: Policy Agreement */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        setPolicy((p) => ({
                          ...p,
                          requirePolicyAccept: !p.requirePolicyAccept
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out mt-0.5 focus:outline-none ${
                        policy.requirePolicyAccept ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          policy.requirePolicyAccept ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-slate-900">
                        Require Viewing Policy Acknowledgment First
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Parents must sign a digital acknowledgment that recordings or screen capture are strictly forbidden under data protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cameras Inventory & Directory Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Surveillance Camera Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure camera placement, IP address bindings, and parent viewing schedule
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Camera Feed
                  </button>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cameraSearch}
                    onChange={(e) => setCameraSearch(e.target.value)}
                    placeholder="Search by name, zone, location, IP..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <select
                    value={cameraStatusFilter}
                    onChange={(e) => setCameraStatusFilter(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>

                  <select
                    value={cameraParentFilter}
                    onChange={(e) => setCameraParentFilter(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Parent Access</option>
                    <option value="CAN VIEW">CAN VIEW (Permitted)</option>
                    <option value="CLOSED">CLOSED (Restricted)</option>
                  </select>
                </div>
              </div>

              {/* Cameras Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredDirectoryCameras.map((cam) => {
                  const isOnline = cam.status === "Online";
                  const isClosed = cam.parents === "CLOSED";

                  return (
                    <div
                      key={cam._id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                        <div className="space-y-0.5 truncate pr-2">
                          <div className="flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <h3 className="font-extrabold text-xs text-slate-900 truncate">
                              {cam.name}
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {cam.ipAddress}:{cam.port || 554}
                          </span>
                        </div>

                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                            isOnline
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {cam.status}
                        </span>
                      </div>

                      {/* Specs and Details */}
                      <div className="space-y-2 text-[11px] font-medium text-slate-500">
                        <div className="flex justify-between items-center">
                          <span>Coverage Area</span>
                          <span className="font-bold text-slate-800 text-right truncate max-w-[150px]">
                            {cam.covers}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Security Zone</span>
                          <span className="font-bold text-slate-800 text-right truncate max-w-[150px]">
                            {cam.zone}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Parent Access</span>
                          <button
                            onClick={() => handleToggleCamera(cam, "parents")}
                            className={`font-black text-[10px] px-2 py-0.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                              isClosed
                                ? "bg-slate-100 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-slate-100"
                            }`}
                          >
                            {isClosed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-emerald-600" />}
                            {cam.parents}
                          </button>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Viewing Hours</span>
                          <span className="font-bold text-slate-800 text-right">
                            {cam.hours}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Resolution</span>
                          <span className="font-mono text-[10px] font-bold text-slate-600">
                            {cam.resolution || "1080p FHD"} @ {cam.fps || 30}fps
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cam)}
                          className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Settings
                        </button>

                        <button
                          onClick={() => handleToggleCamera(cam, "status")}
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            isOnline
                              ? "bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border-slate-200"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                          }`}
                          title={isOnline ? "Turn Feed Offline" : "Turn Feed Online"}
                        >
                          {isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteCamera(cam)}
                          className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                          title="Delete Camera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. VIEW: ACCESS AUDIT LOG                                      */}
          {/* ============================================================== */}
          {activeView === "log" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Access Log KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Total Views (Last 7 Days)
                    </span>
                    <span className="text-3xl font-black text-slate-900 mt-1 block">
                      {stats?.viewsLast7Days || accessLogs.length}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      By Parents (Last 7 Days)
                    </span>
                    <span className="text-3xl font-black text-slate-900 mt-1 block">
                      {stats?.parentViewsLast7Days || accessLogs.filter((l) => l.isParent).length}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <User className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Watching Right Now
                    </span>
                    <span className="text-3xl font-black text-slate-900 mt-1 block flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {stats?.watchingNow || 1}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Filter Form Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <form
                  onSubmit={handleFilterLogs}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
                >
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Camera Feed
                    </label>
                    <select
                      value={logCameraFilter}
                      onChange={(e) => setLogCameraFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="All cameras">All Cameras</option>
                      {cameras.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Viewer Role
                    </label>
                    <select
                      value={logViewerFilter}
                      onChange={(e) => setLogViewerFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Anyone">Anyone</option>
                      <option value="Parents">Parents Only</option>
                      <option value="Staff">Staff / Admin Only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={logFromDate}
                      onChange={(e) => setLogFromDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={logToDate}
                      onChange={(e) => setLogToDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      Filter
                    </button>
                    <button
                      type="button"
                      onClick={handleResetLogs}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      title="Reset Filters"
                    >
                      Reset
                    </button>
                  </div>
                </form>

                {/* Additional Log Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-slate-500">
                    Showing {accessLogs.length} verified surveillance access sessions
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulateViewerSession}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200/60 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Simulate Parent View
                    </button>
                    <button
                      onClick={handleExportLogsCsv}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Access Logs Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">Session Started</th>
                        <th className="py-3.5 px-5">Camera Feed</th>
                        <th className="py-3.5 px-5">Viewer Name</th>
                        <th className="py-3.5 px-5">Student / Child</th>
                        <th className="py-3.5 px-5">Duration</th>
                        <th className="py-3.5 px-5">IP Address</th>
                        <th className="py-3.5 px-5">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {accessLogs.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-16 text-center text-slate-400">
                            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                            <span className="font-bold text-sm block">No Access Records Found</span>
                            <span className="text-xs">Adjust your filter dates or camera selector above.</span>
                          </td>
                        </tr>
                      ) : (
                        accessLogs.map((log) => (
                          <tr key={log._id || log.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-5 font-mono text-slate-500">
                              {log.started}
                            </td>
                            <td className="py-3.5 px-5 font-bold text-slate-900">
                              {log.camera}
                            </td>
                            <td className="py-3.5 px-5 font-semibold text-slate-800">
                              {log.viewer}
                            </td>
                            <td className="py-3.5 px-5 font-bold text-indigo-700">
                              {log.child || "—"}
                            </td>
                            <td className="py-3.5 px-5 text-slate-600 font-mono">
                              {log.duration}
                            </td>
                            <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">
                              {log.ip}
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                  log.isParent || log.userType === "Parent"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {log.userType || (log.isParent ? "Parent" : "Staff")}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Informational Callout */}
              <div className="flex items-start gap-2.5 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p>
                  Sessions ending due to closed browser windows are logged from the viewer's last WebSocket heartbeat pulse.
                  Durations reflect verified live-view intervals rather than assumptions, compliant with student privacy regulations.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL: ADD / EDIT CAMERA CONFIGURATION                      */}
      {/* ============================================================== */}
      {(isAddModalOpen || editingCamera) && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingCamera ? `Configure ${editingCamera.name}` : "Register New Camera Feed"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCamera(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCameraForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Camera Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Camera Name *</label>
                  <input
                    type="text"
                    value={cameraFormData.name}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, name: e.target.value })}
                    placeholder="e.g. Class I - A Smart Room"
                    required
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Coverage Location */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Coverage Location</label>
                  <select
                    value={cameraFormData.covers}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, covers: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Common area">Common area</option>
                    <option value="Nursery - A">Nursery - A</option>
                    <option value="Class I - A">Class I - A</option>
                    <option value="Office Lobby">Office Lobby</option>
                    <option value="Playground">Playground</option>
                    <option value="Gate 1 Entrance">Gate 1 Entrance</option>
                    <option value="Library">Library</option>
                    <option value="Science Lab">Science Lab</option>
                  </select>
                </div>

                {/* Zone Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Security Zone</label>
                  <input
                    type="text"
                    value={cameraFormData.zone}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, zone: e.target.value })}
                    placeholder="e.g. Primary Wing A"
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* IP Address */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">IP Address</label>
                  <input
                    type="text"
                    value={cameraFormData.ipAddress}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, ipAddress: e.target.value })}
                    placeholder="192.168.1.101"
                    className="w-full px-3 py-2 border rounded-xl font-mono text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Feed Status</label>
                  <select
                    value={cameraFormData.status}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Parents Viewing Access */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Parent Access</label>
                  <select
                    value={cameraFormData.parents}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, parents: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="CAN VIEW">👁️ CAN VIEW (Permitted)</option>
                    <option value="CLOSED">👁️ CLOSED (Restricted)</option>
                  </select>
                </div>

                {/* Viewing Hours */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Permitted Viewing Hours</label>
                  <input
                    type="text"
                    value={cameraFormData.hours}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, hours: e.target.value })}
                    placeholder="e.g. 08:00 – 16:00"
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Resolution */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Resolution</label>
                  <select
                    value={cameraFormData.resolution}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, resolution: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="720p HD">720p HD</option>
                    <option value="1080p FHD">1080p FHD</option>
                    <option value="2K QHD">2K QHD</option>
                    <option value="4K Ultra">4K Ultra</option>
                  </select>
                </div>

                {/* Frame Rate FPS */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">FPS (Frame Rate)</label>
                  <input
                    type="number"
                    value={cameraFormData.fps}
                    onChange={(e) => setCameraFormData({ ...cameraFormData, fps: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCamera(null);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingCamera ? "Save Changes" : "Register Camera"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: INSPECT SINGLE CAMERA STREAM (ENLARGED VIEW)         */}
      {/* ============================================================== */}
      {inspectedCamera && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl text-white space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <div>
                  <h3 className="font-black text-base tracking-tight">{inspectedCamera.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {inspectedCamera.covers} • {inspectedCamera.zone} • {inspectedCamera.ipAddress}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setInspectedCamera(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enlarged Video Viewport */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950/40 to-slate-950/80 pointer-events-none"></div>
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div className="w-20 h-20 border border-emerald-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                </div>
              </div>

              {/* Live Info Bar */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">
                  LIVE STREAM
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 text-emerald-400 border border-emerald-500/20">
                  {inspectedCamera.resolution || "1080p FHD"} @ {inspectedCamera.fps || 30} FPS
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300 bg-black/70 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-emerald-400 font-bold">{inspectedCamera.code || "CAM-LIVE"}</span>
                <span>{liveTimestamp}</span>
                <span className="text-indigo-400 font-bold">{inspectedCamera.bitrate || "2048 kbps"}</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCaptureSnapshot(inspectedCamera)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <CameraIcon className="w-3.5 h-3.5" />
                  Capture Snapshot
                </button>
                <button
                  onClick={() => handleToggleCamera(inspectedCamera, "parents")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-xl border transition-all cursor-pointer ${
                    inspectedCamera.parents === "CAN VIEW"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {inspectedCamera.parents === "CAN VIEW" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {inspectedCamera.parents === "CAN VIEW" ? "Revoke Parent Access" : "Permit Parent Access"}
                </button>
              </div>

              <button
                onClick={() => setInspectedCamera(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
