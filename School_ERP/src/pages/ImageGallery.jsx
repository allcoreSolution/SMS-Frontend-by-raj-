import React, { useState, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, Plus, Eye, Trash2, 
  Search, RefreshCw, X, FolderOpen, Calendar, 
  Tag, Sparkles, Layers
} from 'lucide-react';
import Swal from 'sweetalert2';
import { communicateService } from '../api/communicateService';

export default function ImageGallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeAlbumView, setActiveAlbumView] = useState(null);

  // New Album Form state
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    category: 'Sports',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbb6b4904c?w=800&auto=format&fit=crop&q=80',
    photosInput: ''
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await communicateService.getGallery();
      setAlbums(res.data || []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.title.trim()) {
      Swal.fire('Title Required', 'Please enter an album title.', 'warning');
      return;
    }

    try {
      // Split photosInput by newlines or commas
      const rawUrls = newAlbum.photosInput.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
      const photos = rawUrls.map(url => ({
        url,
        caption: `${newAlbum.title} Moment`
      }));

      // If empty, add cover image as first photo
      if (photos.length === 0 && newAlbum.coverImage) {
        photos.push({ url: newAlbum.coverImage, caption: newAlbum.title });
      }

      await communicateService.createAlbum({
        title: newAlbum.title,
        description: newAlbum.description,
        category: newAlbum.category,
        coverImage: newAlbum.coverImage,
        photos
      });

      Swal.fire({
        icon: 'success',
        title: 'Album Created!',
        text: 'The new photo gallery album is now live.',
        confirmButtonColor: '#5542f6'
      });
      setIsAdding(false);
      setNewAlbum({
        title: '',
        description: '',
        category: 'Sports',
        coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbb6b4904c?w=800&auto=format&fit=crop&q=80',
        photosInput: ''
      });
      fetchAlbums();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteAlbum = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Album?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await communicateService.deleteAlbum(id);
        setAlbums(prev => prev.filter(a => a._id !== id));
        Swal.fire('Deleted!', 'Album removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete album.', 'error');
      }
    }
  };

  const categories = ['All', 'Sports', 'Culture', 'Academic', 'Annual Day', 'Campus', 'General'];

  const filteredAlbums = useMemo(() => {
    return albums.filter(a => {
      const matchesSearch = (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (a.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [albums, searchQuery, selectedCategory]);

  return (
    <div className="p-6 bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans flex flex-col">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Institutional Photo Gallery</h1>
            <span className="bg-indigo-50 text-[#5542f6] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
              Media Albums
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Visual albums of sports meets, science exhibitions, cultural festivals, and campus memories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchAlbums}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm"
            title="Refresh Gallery"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] transition-all shadow-md shadow-indigo-100"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Album
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-[#5542f6] text-white' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search albums..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
          />
        </div>
      </div>

      {/* Albums Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5542f6]" />
          <p className="text-xs font-medium">Loading photo albums...</p>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <FolderOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <h3 className="font-bold text-sm text-gray-700">No Albums Found</h3>
          <p className="text-xs text-gray-400 mt-1">Create an album to showcase school activities and events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <div 
              key={album._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all"
            >
              {/* Cover Image Container */}
              <div 
                onClick={() => setActiveAlbumView(album)}
                className="relative h-44 bg-gray-100 cursor-pointer overflow-hidden"
              >
                <img 
                  src={album.coverImage} 
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {album.category}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {album.photos?.length || 1} photos
                </span>
              </div>

              {/* Info & Footer */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => setActiveAlbumView(album)}
                    className="font-extrabold text-sm text-gray-900 cursor-pointer hover:text-[#5542f6] transition-colors line-clamp-1"
                  >
                    {album.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {album.description || 'Institutional memory collection.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span className="text-[10px]">
                    {album.date ? new Date(album.date).toLocaleDateString('en-GB') : '-'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setActiveAlbumView(album)}
                      className="text-[#5542f6] hover:underline font-bold text-xs flex items-center"
                    >
                      <Eye className="w-3 h-3 mr-1" /> View
                    </button>
                    <button 
                      onClick={() => handleDeleteAlbum(album._id, album.title)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="Delete Album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- CREATE ALBUM MODAL ----------------- */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2 text-[#5542f6]" /> Create New Photo Album
              </h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Album Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Annual Day 2026 Celebrations"
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select 
                  value={newAlbum.category}
                  onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                >
                  <option value="Sports">Sports & Athletics</option>
                  <option value="Culture">Cultural & Dance</option>
                  <option value="Academic">Academic & Science</option>
                  <option value="Annual Day">Annual Day</option>
                  <option value="Campus">Campus & Infrastructure</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Cover Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..."
                  value={newAlbum.coverImage}
                  onChange={(e) => setNewAlbum({ ...newAlbum, coverImage: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Additional Photo URLs (Separate by commas or lines)</label>
                <textarea 
                  rows={3}
                  placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                  value={newAlbum.photosInput}
                  onChange={(e) => setNewAlbum({ ...newAlbum, photosInput: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Highlights of the event..."
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-[#5542f6] resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#5542f6] text-white rounded-lg font-bold hover:bg-[#4533e4]"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- ALBUM LIGHTBOX VIEWER MODAL ----------------- */}
      {activeAlbumView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">{activeAlbumView.title}</h3>
                <p className="text-xs text-gray-500">{activeAlbumView.description || 'Album Photos'}</p>
              </div>
              <button 
                onClick={() => setActiveAlbumView(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Photos Grid */}
            <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50">
              {(activeAlbumView.photos && activeAlbumView.photos.length > 0 
                ? activeAlbumView.photos 
                : [{ url: activeAlbumView.coverImage, caption: activeAlbumView.title }]
              ).map((photo, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={photo.url} 
                      alt={photo.caption || 'Album Photo'} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {photo.caption && (
                    <div className="p-2.5 text-xs font-semibold text-gray-700 text-center border-t border-gray-100">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-gray-200 flex justify-between items-center text-xs">
              <span className="text-gray-500">
                Category: <b>{activeAlbumView.category}</b> • {activeAlbumView.photos?.length || 1} Photos
              </span>
              <button 
                onClick={() => setActiveAlbumView(null)}
                className="px-4 py-1.5 bg-[#5542f6] text-white rounded-lg font-bold"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
