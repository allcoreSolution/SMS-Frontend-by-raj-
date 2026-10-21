import React, { useState, useEffect } from 'react';
import {
  Camera,
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  Search,
  RotateCw,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Layers,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowLeft
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function Gallery() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [albums, setAlbums] = useState([]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Album for Detail View
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activePhotoList, setActivePhotoList] = useState([]);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch Gallery Albums from Backend
  const fetchGallery = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await parentService.getGallery(params);
      if (res && res.success && res.data) {
        setAlbums(res.data);
      } else {
        setError('Failed to load gallery albums from server.');
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err?.response?.data?.message || err?.message || 'Error connecting to gallery API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  // Open Lightbox for an Album
  const openLightbox = (photos, initialIndex = 0) => {
    setActivePhotoList(photos);
    setActivePhotoIndex(initialIndex);
    setLightboxOpen(true);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % activePhotoList.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + activePhotoList.length) % activePhotoList.length);
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activePhotoList.length]);

  // Handle Photo Download
  const handlePhotoDownload = (photoUrl, caption) => {
    try {
      const link = document.createElement('a');
      link.href = photoUrl;
      link.target = '_blank';
      link.download = `${(caption || 'school_gallery_photo').replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage({
        type: 'success',
        text: 'Photo download started successfully!'
      });
      setTimeout(() => setToastMessage(null), 3500);
    } catch (e) {
      alert('Unable to trigger automatic download. You can right-click and save image.');
    }
  };

  // Client-side text search over current albums
  const filteredAlbums = albums.filter((alb) => {
    const matchesCategory =
      selectedCategory === 'All' || alb.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesTitle = alb.title?.toLowerCase().includes(query);
    const matchesDesc = alb.description?.toLowerCase().includes(query);
    const matchesPhoto = alb.photos?.some((p) => p.caption?.toLowerCase().includes(query));
    return matchesCategory && (matchesTitle || matchesDesc || matchesPhoto);
  });

  // Calculate total photo count
  const totalPhotosCount = albums.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0);

  const categories = [
    'All',
    'Sports',
    'Culture',
    'Academic',
    'Annual Day',
    'Campus',
    'General'
  ];

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Sports':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Culture':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Academic':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Annual Day':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Campus':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1440px] mx-auto min-h-screen bg-[#f8f9fa] space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-none flex items-center justify-between border shadow-sm transition-all animate-in fade-in ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-gray-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Camera className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-[#1f2937] tracking-tight">
                  Campus Life & Events Image Gallery
                </h1>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                  Academic Year 2026-27
                </span>
              </div>
              <p className="text-[12.5px] text-gray-500 font-medium">
                High-resolution photo albums from athletic tournaments, cultural fests, academic science expos & memorable school moments
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchGallery(true)}
            disabled={refreshing}
            className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Refresh Albums"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{albums.length} Albums • {totalPhotosCount} Photos</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: SINGLE ALBUM DETAIL SHOWCASE                      */}
      {/* ========================================================= */}
      {selectedAlbum ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Back button & Album Title Banner */}
          <div className="bg-white border border-gray-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedAlbum(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All Albums
              </button>
              <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 border ${getCategoryBadgeClass(selectedAlbum.category)}`}>
                {selectedAlbum.category}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {selectedAlbum.title}
              </h2>
              <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">
                {selectedAlbum.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500 font-semibold">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  {new Date(selectedAlbum.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-gray-700">
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  {selectedAlbum.photos?.length || 0} Photographs
                </span>
              </div>

              <button
                onClick={() => openLightbox(selectedAlbum.photos, 0)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Start Slideshow
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedAlbum.photos?.map((photo, idx) => (
              <div
                key={photo._id || idx}
                onClick={() => openLightbox(selectedAlbum.photos, idx)}
                className="group relative bg-gray-100 border border-gray-200 shadow-xs overflow-hidden cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Photo Image */}
                <div className="h-56 w-full overflow-hidden bg-gray-200 relative">
                  <img
                    src={photo.url}
                    alt={photo.caption || selectedAlbum.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 bg-white/90 text-gray-900 rounded-none shadow-sm font-bold text-xs flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View Photo
                    </span>
                  </div>

                  {/* Photo Index Tag */}
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5">
                    #{idx + 1}
                  </span>
                </div>

                {/* Caption Footer */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-800 truncate" title={photo.caption}>
                    {photo.caption || 'Campus Event Photograph'}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePhotoDownload(photo.url, photo.caption);
                    }}
                    className="text-gray-400 hover:text-indigo-600 p-1"
                    title="Download Photo"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* ========================================================= */
        /* VIEW 2: ALL ALBUMS EXPLORER WITH CATEGORY FILTER          */
        /* ========================================================= */
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white border border-gray-200 p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'All' ? `All Albums (${albums.length})` : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event or album..."
                className="pl-8 pr-3 py-1.5 border border-gray-300 text-xs w-[200px] sm:w-[240px] focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-sm min-h-[400px]">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-base font-bold text-gray-800">Loading School Gallery Albums...</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Fetching high-resolution school campus photographs and event archives from database.
              </p>
            </div>
          ) : error ? (
            <div className="bg-white border border-red-200 p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h3 className="text-base font-bold text-gray-800">{error}</h3>
              <button
                onClick={() => fetchGallery(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center space-y-2">
              <Camera className="w-12 h-12 text-gray-300" />
              <h4 className="text-sm font-bold text-gray-700">No albums match this filter</h4>
              <p className="text-xs text-gray-500 max-w-xs">
                Try selecting "All" or searching for a different school event name.
              </p>
            </div>
          ) : (
            /* Albums Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => setSelectedAlbum(album)}
                  className="bg-white border border-gray-200 shadow-sm flex flex-col hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  {/* Thumbnail / Cover Image */}
                  <div className="relative h-[230px] w-full border-b border-gray-100 overflow-hidden bg-gray-100">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 origin-center"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                    {/* Category Badge Top Left */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border shadow-xs ${getCategoryBadgeClass(album.category)}`}>
                        {album.category}
                      </span>
                    </div>

                    {/* Photo Count Badge Top Right */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold border border-white/20">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{album.photos?.length || 0} Photos</span>
                    </div>

                    {/* Title preview on image bottom */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-medium text-gray-200 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-300" />
                        {new Date(album.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-[16px] text-gray-900 leading-snug mb-1.5 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {album.title}
                      </h3>
                      {album.description && (
                        <p className="text-[12.5px] text-gray-600 font-medium leading-relaxed line-clamp-2">
                          {album.description}
                        </p>
                      )}
                    </div>

                    {/* Thumbnail Preview Strip */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center -space-x-2 overflow-hidden">
                        {album.photos?.slice(0, 4).map((p, i) => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                            <img src={p.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {album.photos?.length > 4 && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                            +{album.photos.length - 4}
                          </div>
                        )}
                      </div>

                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                        Explore Album <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FULLSCREEN LIGHTBOX PHOTO VIEWER                   */}
      {/* ========================================================= */}
      {lightboxOpen && activePhotoList.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Photo {activePhotoIndex + 1} of {activePhotoList.length}
                </span>
                <span className="text-[11px] text-gray-400 truncate max-w-md block">
                  {activePhotoList[activePhotoIndex]?.caption || selectedAlbum?.title || 'Campus Photograph'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handlePhotoDownload(
                    activePhotoList[activePhotoIndex]?.url,
                    activePhotoList[activePhotoIndex]?.caption
                  )
                }
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-colors"
                title="Download High-Res Photo"
              >
                <Download className="w-3.5 h-3.5" /> Download Photo
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-none transition-colors"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Photo Canvas */}
          <div className="flex-1 flex items-center justify-between px-2 sm:px-6 relative overflow-hidden">
            {/* Previous Button */}
            <button
              onClick={() =>
                setActivePhotoIndex(
                  (prev) => (prev - 1 + activePhotoList.length) % activePhotoList.length
                )
              }
              className="p-3 bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors z-10"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Current Image */}
            <div className="max-w-4xl max-h-[75vh] mx-auto p-2 flex items-center justify-center">
              <img
                src={activePhotoList[activePhotoIndex]?.url}
                alt={activePhotoList[activePhotoIndex]?.caption || 'Full view'}
                className="max-h-[75vh] max-w-full object-contain shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev + 1) % activePhotoList.length)
              }
              className="p-3 bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors z-10"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Caption & Thumbnails Strip */}
          <div className="border-t border-white/10 pt-3 text-center space-y-2">
            <p className="text-sm font-bold text-white">
              {activePhotoList[activePhotoIndex]?.caption || selectedAlbum?.title}
            </p>

            {/* Thumbnail Navigator Strip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-2xl mx-auto py-1">
              {activePhotoList.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-12 h-10 flex-shrink-0 border-2 overflow-hidden transition-all ${
                    idx === activePhotoIndex
                      ? 'border-indigo-400 scale-105 shadow-md'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={thumb.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
