import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Save, Download, Printer, Undo, Redo, Type, Image as ImageIcon, Square, Circle,
  Minus, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, CheckCircle,
  Copy, Trash2, ZoomIn, ZoomOut, Maximize2, Grid, Eye, EyeOff, Layers, Sparkles,
  Move, ChevronDown, RefreshCw, Upload, Shield, Award, QrCode, Barcode, FileText,
  Sliders, Palette, ArrowUp, ArrowDown, Lock, Unlock, HelpCircle, X, ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';

// Preset Canvas Dimensions
const CANVAS_PRESETS = {
  'A4 Landscape': { width: 842, height: 595, label: 'A4 Landscape (Certificates)', category: 'certificate' },
  'A4 Portrait': { width: 595, height: 842, label: 'A4 Portrait (Certificates & TC)', category: 'certificate' },
  'ID Card Landscape': { width: 540, height: 340, label: 'ID Card Landscape (CR80)', category: 'idcard' },
  'ID Card Portrait': { width: 340, height: 540, label: 'ID Card Vertical (Lanyard)', category: 'idcard' },
  'Letter Landscape': { width: 800, height: 560, label: 'US Letter Landscape', category: 'certificate' },
};

// Available Merge Tag Variables
const MERGE_VARIABLES = [
  { tag: '{{student_name}}', label: 'Student Full Name', sample: 'Aarav Sharma' },
  { tag: '{{admission_no}}', label: 'Admission No', sample: 'DPS/2026/8941' },
  { tag: '{{class}}', label: 'Class', sample: 'X' },
  { tag: '{{section}}', label: 'Section', sample: 'A' },
  { tag: '{{roll_no}}', label: 'Roll Number', sample: '18' },
  { tag: '{{school_name}}', label: 'School / Institution Name', sample: 'Delhi Public World School' },
  { tag: '{{academic_year}}', label: 'Academic Year', sample: '2026-2027' },
  { tag: '{{dob}}', label: 'Date of Birth', sample: '14 August 2010' },
  { tag: '{{father_name}}', label: 'Father Name', sample: 'Vikram Sharma' },
  { tag: '{{mother_name}}', label: 'Mother Name', sample: 'Sunita Sharma' },
  { tag: '{{blood_group}}', label: 'Blood Group', sample: 'O+ Positive' },
  { tag: '{{phone}}', label: 'Emergency Contact', sample: '+91 98765 43210' },
  { tag: '{{issue_date}}', label: 'Issue Date', sample: '05 November 2026' },
  { tag: '{{valid_upto}}', label: 'Valid Upto', sample: '31 March 2027' },
  { tag: '{{principal_name}}', label: 'Principal Name', sample: 'Dr. Rajesh K. Varma' },
  { tag: '{{certificate_no}}', label: 'Certificate Ref No', sample: 'CERT/CBSE/2026-092' },
];

// Pre-built Templates
const PRESET_TEMPLATES = {
  academicExcellence: {
    name: 'Academic Excellence Certificate',
    size: 'A4 Landscape',
    bgColor: '#ffffff',
    bgGradient: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fffbf0 100%)',
    elements: [
      {
        id: 1, type: 'ornate_border', x: 20, y: 20, width: 802, height: 555,
        borderWidth: 8, borderColor: '#d97706', borderStyle: 'double',
        innerBorder: true, innerBorderColor: '#b45309', fill: 'transparent', locked: true
      },
      {
        id: 2, type: 'badge', x: 371, y: 45, width: 100, height: 100,
        badgeType: 'school_crest', color: '#d97706', locked: false
      },
      {
        id: 3, type: 'text', x: 70, y: 155, width: 702, height: 40,
        text: '{{school_name}}', fontSize: 28, fontFamily: 'serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#1e293b'
      },
      {
        id: 4, type: 'text', x: 70, y: 198, width: 702, height: 25,
        text: 'AFFILIATED TO CENTRAL BOARD OF SECONDARY EDUCATION (CBSE)',
        fontSize: 11, fontFamily: 'sans-serif', bold: true, italic: false, underline: false,
        align: 'center', color: '#b45309', letterSpacing: 2
      },
      {
        id: 5, type: 'divider', x: 271, y: 232, width: 300, height: 2,
        color: '#f59e0b', lineStyle: 'solid'
      },
      {
        id: 6, type: 'text', x: 70, y: 245, width: 702, height: 44,
        text: 'CERTIFICATE OF EXCELLENCE', fontSize: 32, fontFamily: 'serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#d97706',
        letterSpacing: 3
      },
      {
        id: 7, type: 'text', x: 70, y: 295, width: 702, height: 24,
        text: 'PROUDLY PRESENTED TO', fontSize: 13, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#64748b',
        letterSpacing: 2
      },
      {
        id: 8, type: 'text', x: 70, y: 326, width: 702, height: 45,
        text: '{{student_name}}', fontSize: 36, fontFamily: 'serif',
        bold: true, italic: true, underline: false, align: 'center', color: '#0f172a'
      },
      {
        id: 9, type: 'divider', x: 221, y: 376, width: 400, height: 1,
        color: '#cbd5e1', lineStyle: 'solid'
      },
      {
        id: 10, type: 'text', x: 100, y: 390, width: 642, height: 50,
        text: 'in recognition of exceptional academic merit, outstanding character, and dedication demonstrated in Class {{class}} - Section {{section}} during the Academic Session {{academic_year}}.',
        fontSize: 13, fontFamily: 'sans-serif', bold: false, italic: false, underline: false,
        align: 'center', color: '#334155'
      },
      {
        id: 11, type: 'badge', x: 120, y: 460, width: 85, height: 85,
        badgeType: 'gold_seal', color: '#d97706', locked: false
      },
      {
        id: 12, type: 'text', x: 280, y: 480, width: 180, height: 20,
        text: 'Date: {{issue_date}}', fontSize: 12, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#475569'
      },
      {
        id: 13, type: 'text', x: 280, y: 502, width: 180, height: 18,
        text: 'Ref: {{certificate_no}}', fontSize: 10, fontFamily: 'monospace',
        bold: false, italic: false, underline: false, align: 'center', color: '#94a3b8'
      },
      {
        id: 14, type: 'signature', x: 580, y: 450, width: 170, height: 55,
        caption: 'Dr. Rajesh K. Varma', title: 'Head of Institution / Principal'
      }
    ]
  },
  studentIdCardHorizontal: {
    name: 'Student ID Card (Horizontal CR80)',
    size: 'ID Card Landscape',
    bgColor: '#ffffff',
    bgGradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    elements: [
      {
        id: 1, type: 'shape', x: 0, y: 0, width: 540, height: 85,
        bgColor: '#ea580c', borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        shapeType: 'rectangle', locked: true
      },
      {
        id: 2, type: 'badge', x: 18, y: 12, width: 60, height: 60,
        badgeType: 'school_crest', color: '#ffffff', locked: false
      },
      {
        id: 3, type: 'text', x: 88, y: 18, width: 340, height: 26,
        text: '{{school_name}}', fontSize: 17, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'left', color: '#ffffff'
      },
      {
        id: 4, type: 'text', x: 88, y: 46, width: 340, height: 18,
        text: 'STUDENT IDENTITY CARD • {{academic_year}}', fontSize: 10, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'left', color: '#fed7aa',
        letterSpacing: 1
      },
      {
        id: 5, type: 'student_photo', x: 25, y: 105, width: 120, height: 140,
        borderColor: '#ea580c', borderWidth: 3, borderRadius: 12
      },
      {
        id: 6, type: 'text', x: 165, y: 105, width: 350, height: 26,
        text: '{{student_name}}', fontSize: 20, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'left', color: '#0f172a'
      },
      {
        id: 7, type: 'text', x: 165, y: 135, width: 350, height: 20,
        text: 'Class: {{class}} - {{section}} | Roll: {{roll_no}}', fontSize: 13,
        fontFamily: 'sans-serif', bold: true, italic: false, underline: false,
        align: 'left', color: '#ea580c'
      },
      {
        id: 8, type: 'text', x: 165, y: 160, width: 350, height: 18,
        text: 'Admission No: {{admission_no}}', fontSize: 12, fontFamily: 'monospace',
        bold: false, italic: false, underline: false, align: 'left', color: '#475569'
      },
      {
        id: 9, type: 'text', x: 165, y: 182, width: 350, height: 18,
        text: 'Father: {{father_name}}', fontSize: 12, fontFamily: 'sans-serif',
        bold: false, italic: false, underline: false, align: 'left', color: '#475569'
      },
      {
        id: 10, type: 'text', x: 165, y: 204, width: 350, height: 18,
        text: 'Blood Group: {{blood_group}} | Ph: {{phone}}', fontSize: 11,
        fontFamily: 'sans-serif', bold: true, italic: false, underline: false,
        align: 'left', color: '#1e293b'
      },
      {
        id: 11, type: 'shape', x: 0, y: 265, width: 540, height: 75,
        bgColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0,
        shapeType: 'rectangle', locked: true
      },
      {
        id: 12, type: 'barcode', x: 25, y: 275, width: 200, height: 48,
        code: 'DPS20268941'
      },
      {
        id: 13, type: 'qr', x: 440, y: 268, width: 68, height: 68
      },
      {
        id: 14, type: 'text', x: 240, y: 285, width: 180, height: 16,
        text: 'Principal Auth Sign', fontSize: 10, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#64748b'
      },
      {
        id: 15, type: 'text', x: 240, y: 305, width: 180, height: 14,
        text: 'Valid Thru: {{valid_upto}}', fontSize: 9, fontFamily: 'sans-serif',
        bold: false, italic: false, underline: false, align: 'center', color: '#94a3b8'
      }
    ]
  },
  studentIdCardVertical: {
    name: 'Student ID Card (Vertical Lanyard)',
    size: 'ID Card Portrait',
    bgColor: '#ffffff',
    bgGradient: 'none',
    elements: [
      {
        id: 1, type: 'shape', x: 130, y: 10, width: 80, height: 14,
        bgColor: '#e2e8f0', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 7,
        shapeType: 'rectangle', locked: true
      },
      {
        id: 2, type: 'shape', x: 0, y: 35, width: 340, height: 75,
        bgColor: '#1e1b4b', borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        shapeType: 'rectangle', locked: true
      },
      {
        id: 3, type: 'badge', x: 20, y: 42, width: 55, height: 55,
        badgeType: 'school_crest', color: '#fbbf24', locked: false
      },
      {
        id: 4, type: 'text', x: 85, y: 44, width: 240, height: 22,
        text: '{{school_name}}', fontSize: 14, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'left', color: '#ffffff'
      },
      {
        id: 5, type: 'text', x: 85, y: 70, width: 240, height: 16,
        text: 'STUDENT IDENTITY PASS', fontSize: 10, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'left', color: '#fbbf24',
        letterSpacing: 1
      },
      {
        id: 6, type: 'student_photo', x: 95, y: 125, width: 150, height: 170,
        borderColor: '#4338ca', borderWidth: 3, borderRadius: 16
      },
      {
        id: 7, type: 'text', x: 20, y: 310, width: 300, height: 28,
        text: '{{student_name}}', fontSize: 20, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#0f172a'
      },
      {
        id: 8, type: 'text', x: 20, y: 340, width: 300, height: 20,
        text: 'Class {{class}} - {{section}} | Roll: {{roll_no}}', fontSize: 14,
        fontFamily: 'sans-serif', bold: true, italic: false, underline: false,
        align: 'center', color: '#4338ca'
      },
      {
        id: 9, type: 'text', x: 20, y: 368, width: 300, height: 18,
        text: 'Adm No: {{admission_no}}', fontSize: 12, fontFamily: 'monospace',
        bold: false, italic: false, underline: false, align: 'center', color: '#64748b'
      },
      {
        id: 10, type: 'text', x: 20, y: 390, width: 300, height: 18,
        text: 'Blood: {{blood_group}} | DOB: {{dob}}', fontSize: 11,
        fontFamily: 'sans-serif', bold: false, italic: false, underline: false,
        align: 'center', color: '#475569'
      },
      {
        id: 11, type: 'text', x: 20, y: 410, width: 300, height: 18,
        text: 'Emergency: {{phone}}', fontSize: 11, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#e11d48'
      },
      {
        id: 12, type: 'qr', x: 135, y: 440, width: 70, height: 70
      },
      {
        id: 13, type: 'text', x: 20, y: 515, width: 300, height: 16,
        text: 'Valid Thru: {{valid_upto}} • School Bus Zone 4', fontSize: 9,
        fontFamily: 'sans-serif', bold: true, italic: false, underline: false,
        align: 'center', color: '#94a3b8'
      }
    ]
  },
  sportsMerit: {
    name: 'Sports Championship Merit Certificate',
    size: 'A4 Landscape',
    bgColor: '#ffffff',
    bgGradient: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fef2f2 100%)',
    elements: [
      {
        id: 1, type: 'ornate_border', x: 20, y: 20, width: 802, height: 555,
        borderWidth: 6, borderColor: '#dc2626', borderStyle: 'solid',
        innerBorder: true, innerBorderColor: '#f59e0b', fill: 'transparent', locked: true
      },
      {
        id: 2, type: 'badge', x: 371, y: 45, width: 100, height: 100,
        badgeType: 'sports_trophy', color: '#dc2626', locked: false
      },
      {
        id: 3, type: 'text', x: 70, y: 155, width: 702, height: 38,
        text: '{{school_name}} - ANNUAL ATHLETICS MEET', fontSize: 24,
        fontFamily: 'sans-serif', bold: true, italic: false, underline: false,
        align: 'center', color: '#991b1b', letterSpacing: 2
      },
      {
        id: 4, type: 'text', x: 70, y: 205, width: 702, height: 44,
        text: 'CERTIFICATE OF SPORTS MERIT', fontSize: 32, fontFamily: 'serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#dc2626',
        letterSpacing: 3
      },
      {
        id: 5, type: 'text', x: 70, y: 260, width: 702, height: 24,
        text: 'THIS IS AWARDED WITH PRIDE TO', fontSize: 13, fontFamily: 'sans-serif',
        bold: true, italic: false, underline: false, align: 'center', color: '#64748b',
        letterSpacing: 2
      },
      {
        id: 6, type: 'text', x: 70, y: 295, width: 702, height: 45,
        text: '{{student_name}}', fontSize: 36, fontFamily: 'serif',
        bold: true, italic: true, underline: false, align: 'center', color: '#0f172a'
      },
      {
        id: 7, type: 'text', x: 100, y: 360, width: 642, height: 50,
        text: 'of Class {{class}}-{{section}} for securing 1ST POSITION (GOLD MEDAL) in Inter-School 100M Sprint / Athletic Championship held on {{issue_date}}.',
        fontSize: 14, fontFamily: 'sans-serif', bold: false, italic: false, underline: false,
        align: 'center', color: '#334155'
      },
      {
        id: 8, type: 'signature', x: 140, y: 460, width: 180, height: 55,
        caption: 'Coach Sandeep Singh', title: 'Director of Physical Education'
      },
      {
        id: 9, type: 'badge', x: 376, y: 445, width: 90, height: 90,
        badgeType: 'gold_seal', color: '#f59e0b', locked: false
      },
      {
        id: 10, type: 'signature', x: 550, y: 460, width: 180, height: 55,
        caption: '{{principal_name}}', title: 'Head of Institution / Principal'
      }
    ]
  }
};

const CanvasDesigner = () => {
  // State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('academicExcellence');
  const [canvasPresetKey, setCanvasPresetKey] = useState('A4 Landscape');
  const [canvasWidth, setCanvasWidth] = useState(842);
  const [canvasHeight, setCanvasHeight] = useState(595);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgGradient, setBgGradient] = useState('radial-gradient(circle at 50% 50%, #ffffff 0%, #fffbf0 100%)');
  const [elements, setElements] = useState(PRESET_TEMPLATES.academicExcellence.elements);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showPreviewData, setShowPreviewData] = useState(true);
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'elements' | 'variables' | 'layers'
  const [history, setHistory] = useState([PRESET_TEMPLATES.academicExcellence.elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Dragging & Interaction Refs
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  // Sync canvas dimensions with preset
  useEffect(() => {
    const preset = CANVAS_PRESETS[canvasPresetKey];
    if (preset) {
      setCanvasWidth(preset.width);
      setCanvasHeight(preset.height);
    }
  }, [canvasPresetKey]);

  // Push state to history
  const pushHistory = useCallback((newElements) => {
    setHistory(prev => {
      const slice = prev.slice(0, historyIndex + 1);
      return [...slice, JSON.parse(JSON.stringify(newElements))];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Keyboard Shortcuts (Delete, Undo, Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          deleteSelectedElement();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, historyIndex, history]);

  // Load Template
  const loadTemplate = (key) => {
    const t = PRESET_TEMPLATES[key];
    if (!t) return;
    setSelectedTemplateKey(key);
    setCanvasPresetKey(t.size);
    setBgColor(t.bgColor || '#ffffff');
    setBgGradient(t.bgGradient || 'none');
    const cloned = JSON.parse(JSON.stringify(t.elements));
    setElements(cloned);
    setSelectedId(null);
    setHistory([cloned]);
    setHistoryIndex(0);
    Swal.fire({
      icon: 'success',
      title: 'Template Loaded',
      text: `Loaded "${t.name}" successfully!`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  // Replace variables in text with sample preview data
  const renderResolvedText = (rawText) => {
    if (!showPreviewData || !rawText) return rawText;
    let res = rawText;
    MERGE_VARIABLES.forEach(v => {
      res = res.replaceAll(v.tag, v.sample);
    });
    return res;
  };

  // Element Selection
  const selectedElement = elements.find(el => el.id === selectedId);

  // Update specific element property
  const updateElement = (id, updates) => {
    setElements(prev => {
      const next = prev.map(el => el.id === id ? { ...el, ...updates } : el);
      pushHistory(next);
      return next;
    });
  };

  // Duplicate Element
  const duplicateElement = (id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const newEl = {
      ...JSON.parse(JSON.stringify(el)),
      id: Date.now(),
      x: el.x + 20,
      y: el.y + 20
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    pushHistory(next);
  };

  // Delete Element
  const deleteSelectedElement = () => {
    if (!selectedId) return;
    const next = elements.filter(el => el.id !== selectedId);
    setElements(next);
    setSelectedId(null);
    pushHistory(next);
  };

  // Layering (Bring to Front, Send to Back)
  const bringToFront = (id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const next = [...elements.filter(e => e.id !== id), el];
    setElements(next);
    pushHistory(next);
  };

  const sendToBack = (id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const next = [el, ...elements.filter(e => e.id !== id)];
    setElements(next);
    pushHistory(next);
  };

  // Alignment helpers
  const alignElement = (direction) => {
    if (!selectedElement) return;
    let newX = selectedElement.x;
    let newY = selectedElement.y;

    if (direction === 'center-h') {
      newX = Math.round((canvasWidth - (selectedElement.width || 200)) / 2);
    } else if (direction === 'center-v') {
      newY = Math.round((canvasHeight - (selectedElement.height || 40)) / 2);
    } else if (direction === 'left') {
      newX = 30;
    } else if (direction === 'right') {
      newX = canvasWidth - (selectedElement.width || 200) - 30;
    } else if (direction === 'top') {
      newY = 30;
    } else if (direction === 'bottom') {
      newY = canvasHeight - (selectedElement.height || 40) - 30;
    }

    updateElement(selectedElement.id, { x: newX, y: newY });
  };

  // Dragging logic
  const handleElementMouseDown = (e, el) => {
    if (el.locked) return;
    e.stopPropagation();
    setSelectedId(el.id);
    isDraggingRef.current = true;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    elementStartPosRef.current = { x: el.x, y: el.y };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !selectedId) return;
    const dx = (e.clientX - dragStartPosRef.current.x) / zoom;
    const dy = (e.clientY - dragStartPosRef.current.y) / zoom;

    setElements(prev => prev.map(el => {
      if (el.id === selectedId) {
        return {
          ...el,
          x: Math.round(elementStartPosRef.current.x + dx),
          y: Math.round(elementStartPosRef.current.y + dy)
        };
      }
      return el;
    }));
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      pushHistory(elements);
    }
  };

  // Add Elements
  const addText = (presetType = 'heading') => {
    const id = Date.now();
    let newEl = {
      id,
      type: 'text',
      x: 80,
      y: 120,
      width: 400,
      height: 40,
      text: 'New Heading Text',
      fontSize: 24,
      fontFamily: 'serif',
      bold: true,
      italic: false,
      underline: false,
      align: 'center',
      color: '#1e293b'
    };

    if (presetType === 'subheading') {
      newEl = {
        ...newEl,
        text: 'Subtitle / Description text',
        fontSize: 14,
        fontFamily: 'sans-serif',
        bold: false,
        color: '#64748b'
      };
    } else if (presetType === 'body') {
      newEl = {
        ...newEl,
        text: 'This is to formally certify that the designated student has completed all required criteria...',
        fontSize: 12,
        fontFamily: 'sans-serif',
        bold: false,
        color: '#334155',
        align: 'left'
      };
    }

    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(id);
    pushHistory(next);
  };

  const addShape = (shapeType = 'rectangle') => {
    const id = Date.now();
    const newEl = {
      id,
      type: 'shape',
      shapeType,
      x: 100,
      y: 100,
      width: shapeType === 'circle' ? 120 : 250,
      height: shapeType === 'circle' ? 120 : 140,
      bgColor: '#fed7aa',
      borderColor: '#ea580c',
      borderWidth: 2,
      borderRadius: shapeType === 'circle' ? 999 : 8
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(id);
    pushHistory(next);
  };

  const addDivider = () => {
    const id = Date.now();
    const newEl = {
      id,
      type: 'divider',
      x: 100,
      y: 150,
      width: 400,
      height: 2,
      color: '#d97706',
      lineStyle: 'solid'
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(id);
    pushHistory(next);
  };

  const addBadge = (badgeType = 'gold_seal') => {
    const id = Date.now();
    const newEl = {
      id,
      type: 'badge',
      badgeType,
      x: 120,
      y: 120,
      width: 90,
      height: 90,
      color: '#d97706',
      locked: false
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(id);
    pushHistory(next);
  };

  const addSignatureBox = () => {
    const id = Date.now();
    const newEl = {
      id,
      type: 'signature',
      x: 200,
      y: 200,
      width: 180,
      height: 60,
      caption: '{{principal_name}}',
      title: 'Principal / Head Administrator'
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(id);
    pushHistory(next);
  };

  const addBarcodeOrQR = (type = 'barcode') => {
    const id = Date.now();
    const newEl = {
      id,
      type,
      x: 150,
      y: 150,
      width: type === 'barcode' ? 200 : 80,
      height: type === 'barcode' ? 50 : 80,
      code: 'DPS20268941'
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(id);
    pushHistory(next);
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (!src) return;
      const id = Date.now();
      const newEl = {
        id,
        type: 'image',
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        src,
        borderRadius: 8,
        borderColor: '#e2e8f0',
        borderWidth: 1
      };
      const next = [...elements, newEl];
      setElements(next);
      setSelectedId(id);
      pushHistory(next);
      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded',
        text: 'Custom image added to canvas!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Insert Merge Variable into selected text element
  const insertVariableIntoSelected = (tag) => {
    if (!selectedElement || selectedElement.type !== 'text') {
      Swal.fire({
        icon: 'info',
        title: 'Select a Text Element',
        text: 'Click on any text block on canvas first, then click a variable to insert it.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      return;
    }
    const current = selectedElement.text || '';
    updateElement(selectedElement.id, { text: current + ' ' + tag });
  };

  // Save template to localStorage
  const saveTemplateLocally = () => {
    const templateData = {
      name: `Custom Design - ${new Date().toLocaleTimeString()}`,
      size: canvasPresetKey,
      width: canvasWidth,
      height: canvasHeight,
      bgColor,
      bgGradient,
      elements
    };
    try {
      localStorage.setItem('superadmin_saved_canvas', JSON.stringify(templateData));
      Swal.fire({
        icon: 'success',
        title: 'Template Saved!',
        text: 'Your custom canvas design has been saved to your browser session.',
        confirmButtonColor: '#ea580c'
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: 'Storage limit exceeded.' });
    }
  };

  // Print Output
  const handlePrint = () => {
    window.print();
  };

  // Export as PNG (Pure SVG data URL rasterization)
  const exportAsImage = () => {
    const svgElem = document.getElementById('canvas-svg-export');
    if (!svgElem) return;

    try {
      const xml = new XMLSerializer().serializeToString(svgElem);
      const svg64 = btoa(unescape(encodeURIComponent(xml)));
      const image64 = 'data:image/svg+xml;base64,' + svg64;

      const img = new window.Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth * 2;
        tempCanvas.height = canvasHeight * 2;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          const a = document.createElement('a');
          a.download = `${selectedTemplateKey || 'design'}_${Date.now()}.png`;
          a.href = tempCanvas.toDataURL('image/png');
          a.click();
          Swal.fire({
            icon: 'success',
            title: 'Exported as PNG',
            text: 'High-resolution PNG downloaded successfully!',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
      };
      img.src = image64;
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Export Error',
        text: 'Could not export directly. Use Print -> Save as PDF for high quality.'
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-4 sm:-m-6 bg-slate-900 text-slate-100 overflow-hidden select-none">
      
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* TOP HEADER / ACTION BAR */}
      <header className="h-14 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-wide uppercase">MultiSchool Canvas Studio</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                PRO DESIGNER
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400">Certificates, Student & Faculty ID Cards, Badges & Transcripts</p>
          </div>
        </div>

        {/* Center Quick Tools */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-[11px] font-mono text-orange-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(2.0, Number((prev + 0.1).toFixed(1))))}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1.0)}
              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(prev => !prev)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${showGrid ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title="Toggle Alignment Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[10.5px]">Grid</span>
          </button>

          {/* Sample Data Toggle */}
          <button
            onClick={() => setShowPreviewData(prev => !prev)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${showPreviewData ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title="Toggle Sample Student Data vs Raw Tags"
          >
            {showPreviewData ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[10.5px]">Sample Data</span>
          </button>
        </div>

        {/* Right Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={exportAsImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={saveTemplateLocally}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Design</span>
          </button>
        </div>
      </header>

      {/* 3-COLUMN WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ======================================================== */}
        {/* LEFT TOOLBAR & PALETTE DRAWER */}
        {/* ======================================================== */}
        <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-20 overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 p-2 gap-1 bg-slate-900/60 border-b border-slate-800 text-center">
            {[
              { id: 'templates', label: 'Templates' },
              { id: 'elements', label: 'Elements' },
              { id: 'variables', label: 'Tags' },
              { id: 'layers', label: 'Layers' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            
            {/* 1. TEMPLATES TAB */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Preset Templates</h3>
                  <div className="space-y-2">
                    {Object.entries(PRESET_TEMPLATES).map(([key, tpl]) => (
                      <div
                        key={key}
                        onClick={() => loadTemplate(key)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                          selectedTemplateKey === key
                            ? 'bg-orange-500/10 border-orange-500 text-white'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs group-hover:text-orange-400 transition-colors">{tpl.name}</span>
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{tpl.size}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Click to apply pre-configured layout & variables.</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Canvas Canvas Dimensions</h3>
                  <select
                    value={canvasPresetKey}
                    onChange={(e) => setCanvasPresetKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    {Object.entries(CANVAS_PRESETS).map(([key, p]) => (
                      <option key={key} value={key}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Canvas Background Theme</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Solid Color:</span>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => { setBgColor(e.target.value); setBgGradient('none'); }}
                        className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                      />
                      <span className="text-slate-300 font-mono text-[11px]">{bgColor}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {[
                        { label: 'Gold Elegance', bg: '#ffffff', grad: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fffbf0 100%)' },
                        { label: 'Deep Navy', bg: '#0f172a', grad: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
                        { label: 'Clean Pearl', bg: '#f8fafc', grad: 'none' },
                        { label: 'Crimson Honor', bg: '#ffffff', grad: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fef2f2 100%)' },
                      ].map((th, i) => (
                        <button
                          key={i}
                          onClick={() => { setBgColor(th.bg); setBgGradient(th.grad); }}
                          className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-[10.5px] font-semibold text-slate-300 text-left cursor-pointer transition-colors"
                        >
                          {th.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ELEMENTS TAB */}
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Typography</h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => addText('heading')}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 text-slate-200 transition-all cursor-pointer"
                    >
                      <Type className="w-4 h-4 text-orange-400" />
                      <div className="text-left">
                        <p className="font-bold text-xs">Add Heading</p>
                        <p className="text-[9.5px] text-slate-400">Large 28pt Serif title for awards</p>
                      </div>
                    </button>

                    <button
                      onClick={() => addText('subheading')}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 text-slate-200 transition-all cursor-pointer"
                    >
                      <Type className="w-4 h-4 text-amber-400" />
                      <div className="text-left">
                        <p className="font-bold text-xs">Add Subheading</p>
                        <p className="text-[9.5px] text-slate-400">14pt Sans label or category header</p>
                      </div>
                    </button>

                    <button
                      onClick={() => addText('body')}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 text-slate-200 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <div className="text-left">
                        <p className="font-bold text-xs">Add Narrative Paragraph</p>
                        <p className="text-[9.5px] text-slate-400">Multi-line body with variable support</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Containers & Shapes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addShape('rectangle')}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Square className="w-5 h-5 text-orange-400" />
                      <span className="text-[10.5px] font-bold">Box / Card</span>
                    </button>

                    <button
                      onClick={() => addShape('circle')}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Circle className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10.5px] font-bold">Circle / Badge</span>
                    </button>

                    <button
                      onClick={addDivider}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Minus className="w-5 h-5 text-amber-400" />
                      <span className="text-[10.5px] font-bold">Divider Line</span>
                    </button>

                    <button
                      onClick={addSignatureBox}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <span className="text-base text-cyan-400">✍️</span>
                      <span className="text-[10.5px] font-bold">Signature Line</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Graphics & Security</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-purple-400" />
                      <span className="text-[10.5px] font-bold">Upload Image</span>
                    </button>

                    <button
                      onClick={() => addBadge('gold_seal')}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="text-[10.5px] font-bold">Verified Seal</span>
                    </button>

                    <button
                      onClick={() => addBadge('school_crest')}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-[10.5px] font-bold">School Crest</span>
                    </button>

                    <button
                      onClick={() => addBarcodeOrQR('barcode')}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <Barcode className="w-5 h-5 text-slate-300" />
                      <span className="text-[10.5px] font-bold">Barcode</span>
                    </button>

                    <button
                      onClick={() => addBarcodeOrQR('qr')}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-200 cursor-pointer"
                    >
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10.5px] font-bold">QR Code</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DYNAMIC VARIABLES TAB */}
            {activeTab === 'variables' && (
              <div className="space-y-3">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2.5">
                  <p className="text-[10.5px] font-bold text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    One-Click Variable Tags
                  </p>
                  <p className="text-[9.5px] text-slate-300 mt-1 leading-relaxed">
                    Select a text element on the canvas, then click any tag below to insert it at the cursor position.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {MERGE_VARIABLES.map(v => (
                    <button
                      key={v.tag}
                      onClick={() => insertVariableIntoSelected(v.tag)}
                      className="w-full text-left p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-850 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="font-mono text-[10.5px] font-bold text-orange-400 group-hover:text-amber-300">{v.tag}</p>
                        <p className="text-[9px] text-slate-400">{v.label}</p>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-500 group-hover:text-slate-300">
                        "{v.sample}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LAYERS TAB */}
            {activeTab === 'layers' && (
              <div className="space-y-2">
                <p className="text-[10.5px] text-slate-400">Total {elements.length} elements on canvas:</p>
                <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {[...elements].reverse().map(el => (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedId === el.id
                          ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] uppercase font-bold text-orange-400">[{el.type}]</span>
                        <span className="text-xs truncate">{el.text || el.badgeType || el.type}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); bringToFront(el.id); }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Bring to Top"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); sendToBack(el.id); }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Send to Bottom"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* ======================================================== */}
        {/* CENTER INTERACTIVE CANVAS WORKSPACE */}
        {/* ======================================================== */}
        <main
          className="flex-1 bg-slate-900/90 relative overflow-auto flex items-center justify-center p-8 sm:p-12"
          onClick={() => setSelectedId(null)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Alignment grid background */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* THE ZOOMABLE DOCUMENT CONTAINER */}
          <div
            ref={canvasRef}
            className="relative shadow-2xl transition-transform duration-75 origin-center shrink-0 border border-slate-700/80 rounded-sm"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              background: bgGradient !== 'none' ? bgGradient : bgColor,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* SVG Elements Rendering Layer (also used for export) */}
            <svg
              id="canvas-svg-export"
              width={canvasWidth}
              height={canvasHeight}
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Optional background rect for SVG exports */}
              <rect width="100%" height="100%" fill={bgColor} />
            </svg>

            {/* DOM Element Layer */}
            {elements.map(el => {
              const isSelected = selectedId === el.id;

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                  className={`absolute group cursor-move select-none transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-orange-500 ring-offset-1 ring-offset-slate-900 shadow-xl'
                      : 'hover:ring-1 hover:ring-blue-400/60'
                  }`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: el.width ? `${el.width}px` : 'auto',
                    height: el.height ? `${el.height}px` : 'auto',
                    zIndex: isSelected ? 30 : 10
                  }}
                >
                  {/* TEXT ELEMENT */}
                  {el.type === 'text' && (
                    <div
                      style={{
                        fontFamily: el.fontFamily || 'sans-serif',
                        fontSize: `${el.fontSize || 14}px`,
                        fontWeight: el.bold ? 'bold' : 'normal',
                        fontStyle: el.italic ? 'italic' : 'normal',
                        textDecoration: el.underline ? 'underline' : 'none',
                        textAlign: el.align || 'left',
                        color: el.color || '#1e293b',
                        letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : 'normal',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.3
                      }}
                    >
                      {renderResolvedText(el.text)}
                    </div>
                  )}

                  {/* SHAPE ELEMENT */}
                  {el.type === 'shape' && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: el.bgColor || '#fed7aa',
                        borderColor: el.borderColor || '#ea580c',
                        borderWidth: `${el.borderWidth || 0}px`,
                        borderRadius: `${el.borderRadius || 0}px`,
                        borderStyle: 'solid'
                      }}
                    />
                  )}

                  {/* ORNATE BORDER ELEMENT */}
                  {el.type === 'ornate_border' && (
                    <div
                      className="w-full h-full relative pointer-events-none"
                      style={{
                        borderColor: el.borderColor || '#d97706',
                        borderWidth: `${el.borderWidth || 8}px`,
                        borderStyle: el.borderStyle || 'double'
                      }}
                    >
                      {el.innerBorder && (
                        <div
                          className="absolute inset-2"
                          style={{
                            borderColor: el.innerBorderColor || '#b45309',
                            borderWidth: '1.5px',
                            borderStyle: 'solid'
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* DIVIDER ELEMENT */}
                  {el.type === 'divider' && (
                    <div
                      style={{
                        width: '100%',
                        height: `${el.height || 2}px`,
                        backgroundColor: el.color || '#d97706'
                      }}
                    />
                  )}

                  {/* BADGE / EMBLEM / TROPHY ELEMENT */}
                  {el.type === 'badge' && (
                    <div className="w-full h-full flex items-center justify-center pointer-events-none">
                      {el.badgeType === 'gold_seal' && (
                        <div className="w-full h-full rounded-full border-4 border-amber-500 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 flex flex-col items-center justify-center shadow-lg text-slate-900 p-1">
                          <Award className="w-6 h-6 text-amber-900" />
                          <span className="text-[7.5px] font-black uppercase tracking-tight text-amber-950">VERIFIED</span>
                          <span className="text-[6.5px] font-black uppercase text-amber-900">ACCREDITED</span>
                        </div>
                      )}

                      {el.badgeType === 'school_crest' && (
                        <div className="w-full h-full flex flex-col items-center justify-center p-1">
                          <div className="w-full h-full rounded-2xl bg-gradient-to-b from-amber-500 to-amber-700 flex items-center justify-center shadow-md border-2 border-white/40">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}

                      {el.badgeType === 'sports_trophy' && (
                        <div className="w-full h-full rounded-full border-4 border-rose-500 bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 flex flex-col items-center justify-center shadow-lg text-white p-1">
                          <span className="text-2xl">🏆</span>
                          <span className="text-[7px] font-black uppercase tracking-tight">1ST PLACE</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STUDENT PHOTO CONTAINER */}
                  {el.type === 'student_photo' && (
                    <div
                      className="w-full h-full bg-slate-100 flex flex-col items-center justify-center overflow-hidden"
                      style={{
                        borderColor: el.borderColor || '#ea580c',
                        borderWidth: `${el.borderWidth || 2}px`,
                        borderRadius: `${el.borderRadius || 8}px`,
                        borderStyle: 'solid'
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold mb-1">
                        PHOTO
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">35mm x 45mm</span>
                    </div>
                  )}

                  {/* SIGNATURE SPECIMEN */}
                  {el.type === 'signature' && (
                    <div className="w-full h-full flex flex-col items-center justify-end text-center pointer-events-none">
                      <div className="text-slate-800 font-serif italic text-lg tracking-wider mb-1">
                        ~ {renderResolvedText(el.caption) || 'Authorized Seal'}
                      </div>
                      <div className="w-full border-b border-slate-700/60 mb-1" />
                      <p className="text-[10px] font-bold text-slate-600">{el.title || 'Principal Signature'}</p>
                    </div>
                  )}

                  {/* BARCODE ELEMENT */}
                  {el.type === 'barcode' && (
                    <div className="w-full h-full bg-white p-1 flex flex-col items-center justify-center border border-slate-300 rounded shadow-xs pointer-events-none">
                      <div className="w-full flex items-center justify-between gap-[2px] h-8 px-1">
                        {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 5, 2, 6, 3, 4, 2, 5, 1, 4, 3, 6, 2, 5].map((h, i) => (
                          <div key={i} className="bg-slate-900 flex-1" style={{ height: `${h * 4 + 8}px` }} />
                        ))}
                      </div>
                      <span className="text-[8px] font-mono font-bold text-slate-800 tracking-widest mt-0.5">
                        {renderResolvedText(el.code || 'DPS20268941')}
                      </span>
                    </div>
                  )}

                  {/* QR CODE ELEMENT */}
                  {el.type === 'qr' && (
                    <div className="w-full h-full bg-white p-1.5 flex items-center justify-center border border-slate-300 rounded shadow-xs pointer-events-none">
                      <QrCode className="w-full h-full text-slate-900" />
                    </div>
                  )}

                  {/* CUSTOM IMAGE ELEMENT */}
                  {el.type === 'image' && (
                    <img
                      src={el.src}
                      alt="Uploaded canvas asset"
                      className="w-full h-full object-cover"
                      style={{
                        borderRadius: `${el.borderRadius || 0}px`,
                        borderWidth: `${el.borderWidth || 0}px`,
                        borderColor: el.borderColor || 'transparent'
                      }}
                    />
                  )}

                  {/* QUICK ELEMENT CONTROLS (WHEN SELECTED) */}
                  {isSelected && (
                    <div className="absolute -top-7 right-0 flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 shadow-lg z-40">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateElement(el.id); }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                        title="Duplicate (Ctrl+D)"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSelectedElement(); }}
                        className="p-1 hover:bg-rose-950/80 rounded text-rose-400 hover:text-rose-200"
                        title="Delete Element"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </main>

        {/* ======================================================== */}
        {/* RIGHT INSPECTOR PROPERTY PANEL */}
        {/* ======================================================== */}
        <aside className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 z-20 overflow-hidden">
          <div className="h-10 px-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-orange-400" />
              Inspector & Style
            </span>
            {selectedElement && (
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                {selectedElement.type}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {selectedElement ? (
              <div className="space-y-4">
                
                {/* 1. TEXT CONTENT (IF TEXT) */}
                {selectedElement.type === 'text' && (
                  <div className="space-y-2">
                    <label className="text-[10.5px] font-bold uppercase text-slate-400 block">Text Content</label>
                    <textarea
                      rows={3}
                      value={selectedElement.text || ''}
                      onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono resize-y"
                      placeholder="Type text or enter {{variable}}..."
                    />

                    {/* Font Family */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Font Family</label>
                        <select
                          value={selectedElement.fontFamily || 'sans-serif'}
                          onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                        >
                          <option value="serif">Classic Serif</option>
                          <option value="sans-serif">Modern Sans</option>
                          <option value="monospace">Monospace</option>
                          <option value="cursive">Formal Script</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Font Size</label>
                        <input
                          type="number"
                          value={selectedElement.fontSize || 14}
                          onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                          min={8}
                          max={96}
                        />
                      </div>
                    </div>

                    {/* Formatting Toggles */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => updateElement(selectedElement.id, { bold: !selectedElement.bold })}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${selectedElement.bold ? 'bg-orange-500 border-orange-400 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateElement(selectedElement.id, { italic: !selectedElement.italic })}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${selectedElement.italic ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateElement(selectedElement.id, { underline: !selectedElement.underline })}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${selectedElement.underline ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Underline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-4 bg-slate-800 mx-1" />

                      <button
                        onClick={() => updateElement(selectedElement.id, { align: 'left' })}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${selectedElement.align === 'left' ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Align Left"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateElement(selectedElement.id, { align: 'center' })}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${selectedElement.align === 'center' ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Align Center"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateElement(selectedElement.id, { align: 'right' })}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${selectedElement.align === 'right' ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        title="Align Right"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Text Color */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Text Color</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.color || '#1e293b'}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-300">{selectedElement.color}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SHAPE & CONTAINER PROPERTIES */}
                {selectedElement.type === 'shape' && (
                  <div className="space-y-3">
                    <label className="text-[10.5px] font-bold uppercase text-slate-400 block">Shape Styling</label>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Fill Color</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.bgColor || '#fed7aa'}
                          onChange={(e) => updateElement(selectedElement.id, { bgColor: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-300">{selectedElement.bgColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Border Color</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.borderColor || '#ea580c'}
                          onChange={(e) => updateElement(selectedElement.id, { borderColor: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-slate-300">{selectedElement.borderColor}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Border Width</label>
                        <input
                          type="number"
                          value={selectedElement.borderWidth || 0}
                          onChange={(e) => updateElement(selectedElement.id, { borderWidth: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                          min={0}
                          max={20}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Border Radius</label>
                        <input
                          type="number"
                          value={selectedElement.borderRadius || 0}
                          onChange={(e) => updateElement(selectedElement.id, { borderRadius: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. POSITION & GEOMETRY (ALL ELEMENTS) */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="text-[10.5px] font-bold uppercase text-slate-400 block">Position & Dimensions</label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">X Position (px)</span>
                      <input
                        type="number"
                        value={selectedElement.x || 0}
                        onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Y Position (px)</span>
                      <input
                        type="number"
                        value={selectedElement.y || 0}
                        onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Width (px)</span>
                      <input
                        type="number"
                        value={selectedElement.width || 100}
                        onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Height (px)</span>
                      <input
                        type="number"
                        value={selectedElement.height || 40}
                        onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* One-click Canvas Alignment Tools */}
                  <div className="pt-2">
                    <label className="text-[10px] text-slate-400 block mb-1.5">Canvas Quick Align</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => alignElement('center-h')}
                        className="px-1.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-semibold cursor-pointer"
                      >
                        Center H
                      </button>
                      <button
                        onClick={() => alignElement('center-v')}
                        className="px-1.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-semibold cursor-pointer"
                      >
                        Center V
                      </button>
                      <button
                        onClick={() => alignElement('left')}
                        className="px-1.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-semibold cursor-pointer"
                      >
                        Left
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. ACTIONS & DELETE */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => duplicateElement(selectedElement.id)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      onClick={deleteSelectedElement}
                      className="w-full py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                <Move className="w-8 h-8 mb-2 opacity-40" />
                <p className="font-bold text-xs text-slate-400">No Element Selected</p>
                <p className="text-[10px] mt-1 leading-relaxed">
                  Click any text, seal, photo box or shape on the canvas to inspect and edit its properties.
                </p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CanvasDesigner;
